import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import AIAssistantDrawer from '../components/AIAssistantDrawer';
import SubmissionResultView from '../components/SubmissionResultView';
import {
  FiPlay,
  FiSend,
  FiFileText,
  FiBookOpen,
  FiCheckSquare,
  FiClock,
  FiMaximize2,
  FiChevronLeft,
  FiMinimize2,
  FiAlertCircle,
  FiCpu,
  FiCheck,
  FiRefreshCw,
  FiCheckCircle,
  FiXCircle
} from 'react-icons/fi';

const DEFAULT_TEMPLATES = {
  cpp: `#include <iostream>\n#include <vector>\n\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}`,
  java: `public class Main {\n    public static void main(String[] args) {\n        // Write your solution here\n    }\n}`,
  python: `def solve():\n    # Write your solution here\n    pass\n\nif __name__ == '__main__':\n    solve()`,
  javascript: `function solve() {\n    // Write your solution here\n}\nsolve();`
};

const ProblemDetails = ({ isDarkMode = true, onEarnXp, setCodeContext }) => {
  const { slug } = useParams();
  const { user, updateUser } = useAuth();

  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Left panel tabs: 'description' | 'accepted' | 'editorial' | 'solutions' | 'submissions'
  const [activeTab, setActiveTab] = useState('description');
  const [activeBottomTab, setActiveBottomTab] = useState('testcase');
  const [selectedCase, setSelectedCase] = useState(0);
  const [language, setLanguage] = useState('java');
  const [code, setCode] = useState('');

  const [testResult, setTestResult] = useState(null);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isAIDrawerOpen, setIsAIDrawerOpen] = useState(false);

  // Submissions tab state
  const [problemSubmissions, setProblemSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  const [starterCodeMap, setStarterCodeMap] = useState({});
  const pollingIntervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    };
  }, []);

  // Fetch problem details & sample testcases
  useEffect(() => {
    const fetchProblem = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/problems/${slug}`);

        const success = res.data?.success ?? res.data?.data?.success;
        const probData = res.data?.problem || res.data?.data?.problem || res.data;

        if (success !== false && probData) {
          try {
            const sampleRes = await API.get(`/problems/${slug}/sample-testcases`);
            const sampleTestCases = sampleRes.data?.testCases || sampleRes.data?.data?.testCases || [];

            if (sampleTestCases.length > 0) {
              probData.examples = sampleTestCases.map((tc) => ({
                input: tc.input,
                output: tc.expectedOutput || tc.output,
                explanation: tc.explanation,
              }));
            }
          } catch {
            console.warn('Using default problem examples (sample endpoint fallback)');
          }

          setProblem(probData);

          // Build Starter Code map
          const map = { ...DEFAULT_TEMPLATES };
          if (probData.starterCode && Array.isArray(probData.starterCode)) {
            probData.starterCode.forEach((sc) => {
              if (sc.language && sc.code) {
                map[sc.language.toLowerCase()] = sc.code;
              }
            });
          } else if (probData.starterTemplates) {
            Object.assign(map, probData.starterTemplates);
          }

          setStarterCodeMap(map);

          const defaultLang = map['java'] ? 'java' : Object.keys(map)[0] || 'java';
          const initialCode = map[defaultLang] || DEFAULT_TEMPLATES[defaultLang] || '';
          setLanguage(defaultLang);
          setCode(initialCode);

          if (setCodeContext) {
            setCodeContext({
              problemName: probData.title,
              language: defaultLang,
              code: initialCode,
            });
          }
        } else {
          setError('Problem not found.');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load problem details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [slug]);

  // Fetch user submissions for current problem
  const fetchProblemSubmissions = async () => {
    if (!problem) return;
    try {
      setLoadingSubmissions(true);
      const res = await API.get('/submissions/my');
      const list = res.data?.submissions || res.data?.data?.submissions || res.data || [];
      const currentProblemId = String(problem._id || problem.id);

      const filtered = list.filter((s) => {
        const subProblemId = String(s.problemId?._id || s.problemId || s.problem);
        const subSlug = s.problemId?.slug || s.problemSlug;
        return subProblemId === currentProblemId || subSlug === slug;
      });

      setProblemSubmissions(filtered);
    } catch (err) {
      console.warn('Failed to load problem submissions:', err);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'submissions') {
      fetchProblemSubmissions();
    }
  }, [activeTab, problem]);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    const updatedCode = starterCodeMap[lang] || DEFAULT_TEMPLATES[lang] || '';
    setCode(updatedCode);

    if (setCodeContext) {
      setCodeContext((prev) => ({
        ...prev,
        language: lang,
        code: updatedCode,
      }));
    }
  };

  const handleCodeChange = (newVal) => {
    setCode(newVal || '');
    if (setCodeContext) {
      setCodeContext((prev) => ({
        ...prev,
        code: newVal || '',
      }));
    }
  };

  // Submit code to backend runner / worker queue
  const submitCodeRequest = async (isRun) => {
    if (isRunning) return;
    setIsRunning(true);
    setTestResult(null);

    if (isRun) {
      setActiveBottomTab('result');
    }

    try {
      const endpoint = isRun ? '/submissions/run' : '/submissions';
      const res = await API.post(endpoint, {
        problemId: problem._id || problem.id,
        userId: user?._id || user?.id,
        language,
        sourceCode: code,
      });

      const submissionId = res.data?.submissionId || res.data?.submission?._id;
      if (!submissionId) {
        throw new Error('No submission ID returned from server.');
      }

      pollSubmission(submissionId, isRun);
    } catch (err) {
      setIsRunning(false);
      const errorMsg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to submit code.';
      setTestResult({
        status: 'Submission Error',
        output: errorMsg,
        expected: 'N/A',
      });
    }
  };

  // Poll for worker evaluation status
  const pollSubmission = (submissionId, isRun) => {
    if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);

    let attempts = 0;
    const maxAttempts = 40;

    pollingIntervalRef.current = setInterval(async () => {
      attempts++;

      try {
        const res = await API.get(`/submissions/${submissionId}`);
        const sub = res.data?.submission || res.data;

        if (!sub) return;

        const currentStatus = (sub.status || '').toUpperCase();
        const finishedStates = ['COMPLETED', 'ACCEPTED', 'FAILED', 'ERROR', 'TIME_LIMIT_EXCEEDED', 'WRONG_ANSWER', 'RUNTIME_ERROR'];

        if (finishedStates.includes(currentStatus) || (currentStatus !== 'PENDING' && currentStatus !== 'PROCESSING' && currentStatus !== 'QUEUED')) {
          clearInterval(pollingIntervalRef.current);
          setIsRunning(false);

          const finalVerdict = (sub.verdict || sub.status || 'COMPLETED').toUpperCase();

          const resultPayload = {
            verdict: finalVerdict,
            status: finalVerdict,
            runtime: sub.runtime !== undefined ? sub.runtime : 2,
            memory: sub.memory !== undefined ? sub.memory : 46.8,
            output: sub.output || sub.errorMessage || 'Execution finished.',
            expected: finalVerdict === 'ACCEPTED' ? 'Passed all checks' : (sub.expected || 'See error above or mismatched output'),
            testCasesPassed: sub.testCasesPassed ?? (finalVerdict === 'ACCEPTED' ? 65 : 0),
            totalTestCases: sub.totalTestCases ?? 65,
          };

          setTestResult(resultPayload);

          // If official Submit (not sample Run), switch left view to LeetCode Accepted card
          if (!isRun) {
            setSubmissionResult(resultPayload);
            setActiveTab('accepted');

            if (finalVerdict === 'ACCEPTED') {
              const diff = (problem?.difficulty || 'easy').toLowerCase();
              const xpGained = diff === 'hard' ? 100 : diff === 'medium' ? 50 : 20;

              if (onEarnXp) {
                onEarnXp(xpGained);
              }

              try {
                const profileRes = await API.get('/auth/me');
                const updatedUserData = profileRes.data?.user || profileRes.data;
                if (updatedUserData && updateUser) {
                  updateUser(updatedUserData);
                }
              } catch (syncErr) {
                console.warn('Failed to sync updated profile stats:', syncErr);
              }
            }

            fetchProblemSubmissions();
          }
        }

        if (attempts >= maxAttempts) {
          clearInterval(pollingIntervalRef.current);
          setIsRunning(false);
          setTestResult({
            status: 'TIME_LIMIT_EXCEEDED',
            runtime: '> 3000 ms',
            memory: 'N/A',
            output: 'Worker timed out. Ensure your solution avoids infinite loops and the backend worker is running.',
            expected: 'Execution within time limit',
          });
        }
      } catch (err) {
        clearInterval(pollingIntervalRef.current);
        setIsRunning(false);
        setTestResult({
          status: 'Network Error',
          output: 'Failed to fetch submission status.',
          expected: 'N/A',
        });
      }
    }, 1200);
  };

  const getVerdictStyle = (status) => {
    const s = (status || '').toUpperCase();
    if (s === 'ACCEPTED') return 'text-emerald-400';
    if (s.includes('TIME_LIMIT') || s.includes('ERROR') || s.includes('FAILED') || s.includes('WRONG')) {
      return 'text-rose-400';
    }
    return 'text-amber-400';
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-slate-500 animate-pulse font-sans">
        Loading problem details...
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-rose-400 gap-3 font-sans">
        <div className="flex items-center gap-2">
          <FiAlertCircle className="w-5 h-5" /> {error || 'Problem not found'}
        </div>
        <Link to="/problems" className="text-xs text-emerald-400 font-bold hover:underline">
          Return to Problems
        </Link>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-screen max-h-screen font-sans select-none ${isDarkMode ? 'bg-[#030712] text-slate-200' : 'bg-slate-100 text-slate-900'}`}>
      {/* Top Navbar */}
      <div className={`flex items-center justify-between px-4 py-2 border-b shrink-0 ${isDarkMode ? 'bg-[#0B101D] border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center gap-4">
          <Link to="/problems" className={`flex items-center gap-1.5 text-xs font-bold transition ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>
            <FiChevronLeft className="w-4 h-4" /> Back
          </Link>
          <div className={`h-4 w-px ${isDarkMode ? 'bg-slate-800' : 'bg-slate-300'}`}></div>
          <span className="font-bold text-sm text-white">{problem.title}</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsAIDrawerOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-500/20 transition cursor-pointer"
          >
            <FiCpu className="w-3.5 h-3.5" />
            <span>AI Mentor</span>
          </button>

          <button
            type="button"
            onClick={() => setIsFullScreen(!isFullScreen)}
            className={`p-1.5 rounded-lg transition cursor-pointer ${isDarkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-600 hover:text-slate-900'}`}
          >
            {isFullScreen ? <FiMinimize2 className="w-4 h-4" /> : <FiMaximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Split Body */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-1 p-2 min-h-0 overflow-hidden">
        {/* Left Column: Problem Workspace & Submissions */}
        <div className={`lg:col-span-5 rounded-2xl border flex flex-col overflow-hidden transition-colors ${isDarkMode ? 'bg-[#0B101D] border-slate-800' : 'bg-white border-slate-200'}`}>
          {/* Tab Navigation */}
          <div className={`flex items-center border-b px-2 pt-2 gap-1 text-xs font-bold shrink-0 overflow-x-auto ${isDarkMode ? 'bg-[#050914] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <button
              type="button"
              onClick={() => setActiveTab('description')}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-t-xl transition cursor-pointer shrink-0 ${
                activeTab === 'description'
                  ? isDarkMode
                    ? 'bg-[#0B101D] text-emerald-400 border-t-2 border-emerald-500'
                    : 'bg-white text-emerald-600 border-t-2 border-emerald-600 shadow-xs'
                  : isDarkMode
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FiFileText className="w-3.5 h-3.5" /> Description
            </button>

            {/* Dynamic Accepted / Result Tab */}
            {submissionResult && (
              <button
                type="button"
                onClick={() => setActiveTab('accepted')}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-t-xl transition cursor-pointer shrink-0 ${
                  activeTab === 'accepted'
                    ? isDarkMode
                      ? 'bg-[#0B101D] text-emerald-400 border-t-2 border-emerald-500'
                      : 'bg-white text-emerald-600 border-t-2 border-emerald-600 shadow-xs'
                    : 'text-emerald-400 hover:bg-emerald-500/10'
                }`}
              >
                {submissionResult.status === 'ACCEPTED' ? (
                  <FiCheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <FiXCircle className="w-3.5 h-3.5 text-rose-400" />
                )}
                <span>{submissionResult.status === 'ACCEPTED' ? 'Accepted' : 'Result'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setActiveTab('editorial')}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-t-xl transition cursor-pointer shrink-0 ${
                activeTab === 'editorial'
                  ? isDarkMode
                    ? 'bg-[#0B101D] text-emerald-400 border-t-2 border-emerald-500'
                    : 'bg-white text-emerald-600 border-t-2 border-emerald-600 shadow-xs'
                  : isDarkMode
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FiBookOpen className="w-3.5 h-3.5" /> Editorial
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('solutions')}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-t-xl transition cursor-pointer shrink-0 ${
                activeTab === 'solutions'
                  ? isDarkMode
                    ? 'bg-[#0B101D] text-emerald-400 border-t-2 border-emerald-500'
                    : 'bg-white text-emerald-600 border-t-2 border-emerald-600 shadow-xs'
                  : isDarkMode
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FiCheckSquare className="w-3.5 h-3.5" /> Solutions
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('submissions')}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-t-xl transition cursor-pointer shrink-0 ${
                activeTab === 'submissions'
                  ? isDarkMode
                    ? 'bg-[#0B101D] text-emerald-400 border-t-2 border-emerald-500'
                    : 'bg-white text-emerald-600 border-t-2 border-emerald-600 shadow-xs'
                  : isDarkMode
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FiClock className="w-3.5 h-3.5" /> Submissions
            </button>
          </div>

          {/* Dynamic Content Panel */}
          <div className="overflow-y-auto flex-1 text-sm">
            {/* Tab 1: Description */}
            {activeTab === 'description' && (
              <div className="p-6 space-y-6">
                <div>
                  <h1 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {problem.title}
                  </h1>
                  <div className="flex items-center flex-wrap gap-2 mt-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                      problem.difficulty?.toLowerCase() === 'easy'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : problem.difficulty?.toLowerCase() === 'medium'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {problem.difficulty || 'Easy'}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${isDarkMode ? 'bg-[#050914] text-slate-300 border border-slate-800' : 'bg-slate-100 text-slate-700'}`}>
                      {problem.category || 'Algorithms'}
                    </span>
                    {problem.tags && problem.tags.map((tag) => (
                      <span key={tag} className={`px-2.5 py-1 rounded-full text-xs font-semibold ${isDarkMode ? 'bg-[#050914] text-slate-300 border border-slate-800' : 'bg-slate-100 text-slate-700'}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className={`space-y-3 leading-relaxed font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} whitespace-pre-wrap text-xs`}>
                  {problem.description}
                </div>

                <div className="space-y-4 pt-2">
                  {problem.examples && problem.examples.map((tc, idx) => (
                    <div key={idx} className={`p-4 rounded-2xl border space-y-2 ${isDarkMode ? 'bg-[#050914] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                      <p className={`font-bold text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        Example {idx + 1}:
                      </p>
                      <div className="font-mono text-xs space-y-2">
                        <p>
                          <span className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>Input:</span><br />
                          <span className={isDarkMode ? 'text-emerald-400 font-bold' : 'text-slate-900'}>{tc.input}</span>
                        </p>
                        <p>
                          <span className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>Output:</span><br />
                          <span className={isDarkMode ? 'text-white' : 'text-slate-900'}>{tc.output}</span>
                        </p>
                        {tc.explanation && (
                          <p>
                            <span className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>Explanation:</span><br />
                            <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>{tc.explanation}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {problem.hints && problem.hints.length > 0 && (
                  <div className="space-y-2 pt-4">
                    <p className={`font-bold text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Hints:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      {problem.hints.map((hint, i) => (
                        <li key={i} className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{hint}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Tab: LeetCode-style Accepted View */}
            {activeTab === 'accepted' && submissionResult && (
              <SubmissionResultView
                result={submissionResult}
                submittedCode={code}
                language={language}
                isDarkMode={isDarkMode}
                onBackToDescription={() => setActiveTab('description')}
              />
            )}

            {/* Tab 2: Editorial */}
            {activeTab === 'editorial' && (
              <div className="p-6 space-y-4">
                <h3 className="text-base font-black text-white">Editorial & Optimal Approach</h3>
                {problem.editorial ? (
                  <div className={`p-4 rounded-2xl border leading-relaxed text-xs whitespace-pre-wrap ${isDarkMode ? 'bg-[#050914] border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-800'}`}>
                    {problem.editorial}
                  </div>
                ) : (
                  <div className="p-8 text-center text-xs text-slate-500">
                    Editorial analysis is currently being curated for this challenge. Use the AI Mentor for instant algorithmic hints.
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Solutions */}
            {activeTab === 'solutions' && (
              <div className="p-6 space-y-4">
                <h3 className="text-base font-black text-white">Community & Reference Solutions</h3>
                {problem.solutions && problem.solutions.length > 0 ? (
                  <div className="space-y-3">
                    {problem.solutions.map((sol, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-[#050914] border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-emerald-400">{sol.language || 'Solution'}</span>
                          <span className="text-[10px] text-slate-500">{sol.author || 'Verified Reference'}</span>
                        </div>
                        <pre className="p-3 rounded-xl bg-[#0B101D] text-slate-300 font-mono text-[11px] overflow-x-auto">
                          {sol.code}
                        </pre>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center text-xs text-slate-500">
                    No community solutions published yet. Solve this problem to be the first!
                  </div>
                )}
              </div>
            )}

            {/* Tab 4: Submissions */}
            {activeTab === 'submissions' && (
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-white">Your Past Submissions</h3>
                  <button
                    type="button"
                    onClick={fetchProblemSubmissions}
                    className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
                    title="Refresh Submissions"
                  >
                    <FiRefreshCw className={`w-3.5 h-3.5 ${loadingSubmissions ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                {loadingSubmissions ? (
                  <div className="p-8 text-center text-xs font-mono text-slate-500 animate-pulse">
                    Loading your submissions...
                  </div>
                ) : problemSubmissions.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500">
                    No submissions recorded yet for this problem. Click "Submit" to test your solution.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {problemSubmissions.map((sub, i) => {
                      const isAccepted = (sub.verdict || sub.status || '').toUpperCase() === 'ACCEPTED';

                      return (
                        <div
                          key={sub._id || i}
                          onClick={() => {
                            if (sub.sourceCode) {
                              setCode(sub.sourceCode);
                              if (sub.language) setLanguage(sub.language.toLowerCase());
                            }
                          }}
                          className="p-3.5 rounded-2xl bg-[#050914] border border-slate-800/80 hover:border-slate-700 transition flex items-center justify-between cursor-pointer group"
                        >
                          <div className="flex items-center gap-3">
                            <span className={`p-2 rounded-xl border ${isAccepted ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                              {isAccepted ? <FiCheck className="w-4 h-4" /> : <FiClock className="w-4 h-4" />}
                            </span>
                            <div>
                              <p className={`font-bold text-xs uppercase ${getVerdictStyle(sub.verdict || sub.status)}`}>
                                {sub.verdict || sub.status}
                              </p>
                              <p className="text-[10px] text-slate-400 font-medium font-mono">
                                {sub.language || 'Java'} • {sub.runtime !== undefined ? `${sub.runtime} ms` : '—'} • {sub.createdAt ? new Date(sub.createdAt).toLocaleDateString() : 'Recent'}
                              </p>
                            </div>
                          </div>

                          <span className="text-[11px] font-bold text-slate-500 group-hover:text-emerald-400 transition">
                            Load Code →
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Code Editor & Results */}
        <div className="lg:col-span-7 flex flex-col min-h-0 gap-1">
          {/* Editor Dock */}
          <div className={`flex-1 rounded-2xl border flex flex-col overflow-hidden min-h-0 transition-colors ${isDarkMode ? 'bg-[#0B101D] border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className={`flex items-center justify-between px-3 py-2 border-b ${isDarkMode ? 'bg-[#050914] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className={`text-xs font-bold rounded-lg px-2 py-1 outline-none cursor-pointer ${isDarkMode ? 'bg-[#0B101D] text-slate-200 border border-slate-800' : 'bg-white text-slate-800 border-slate-200'}`}
              >
                {Object.keys(starterCodeMap).length > 0 ? (
                  Object.keys(starterCodeMap).map((lang) => (
                    <option key={lang} value={lang}>
                      {lang === 'cpp' ? 'C++' : lang === 'javascript' ? 'JavaScript' : lang === 'python' ? 'Python' : lang === 'java' ? 'Java' : lang}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="java">Java</option>
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="cpp">C++</option>
                  </>
                )}
              </select>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => submitCodeRequest(true)}
                  disabled={isRunning}
                  className={`px-3 py-1 rounded-lg font-bold text-xs flex items-center gap-1.5 transition border cursor-pointer disabled:opacity-50 ${isDarkMode ? 'bg-[#0B101D] hover:bg-slate-800 text-slate-200 border-slate-800' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'}`}
                >
                  <FiPlay className="w-3 h-3 text-emerald-400 fill-emerald-400" /> Run
                </button>
                <button
                  type="button"
                  onClick={() => submitCodeRequest(false)}
                  disabled={isRunning}
                  className="px-3.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-1.5 transition shadow-sm cursor-pointer disabled:opacity-50"
                >
                  <FiSend className="w-3 h-3" /> Submit
                </button>
              </div>
            </div>

            <div className="flex-1 w-full">
              <Editor
                height="100%"
                theme={isDarkMode ? 'vs-dark' : 'light'}
                language={language === 'cpp' ? 'cpp' : language === 'javascript' ? 'javascript' : language}
                value={code}
                onChange={handleCodeChange}
                options={{
                  fontSize: 13,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  fontFamily: 'Fira Code, monospace',
                  padding: { top: 12 },
                }}
              />
            </div>
          </div>

          {/* Test Case & Result Dock */}
          <div className={`h-56 rounded-2xl border flex flex-col overflow-hidden shrink-0 transition-colors ${isDarkMode ? 'bg-[#0B101D] border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className={`flex items-center border-b px-3 pt-2 gap-2 text-xs font-bold shrink-0 ${isDarkMode ? 'bg-[#050914] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
              <button
                type="button"
                onClick={() => setActiveBottomTab('testcase')}
                className={`px-3 py-1.5 rounded-t-xl transition cursor-pointer ${activeBottomTab === 'testcase' ? (isDarkMode ? 'bg-[#0B101D] text-emerald-400 border-t-2 border-emerald-500' : 'bg-white text-emerald-600 border-t-2 border-emerald-600 shadow-xs') : 'text-slate-500 hover:text-slate-300'}`}
              >
                Testcase
              </button>
              <button
                type="button"
                onClick={() => setActiveBottomTab('result')}
                className={`px-3 py-1.5 rounded-t-xl transition cursor-pointer ${activeBottomTab === 'result' ? (isDarkMode ? 'bg-[#0B101D] text-emerald-400 border-t-2 border-emerald-500' : 'bg-white text-emerald-600 border-t-2 border-emerald-600 shadow-xs') : 'text-slate-500 hover:text-slate-300'}`}
              >
                Test Result
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto font-mono text-xs">
              {activeBottomTab === 'testcase' ? (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    {problem.examples && problem.examples.map((tc, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedCase(idx)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${selectedCase === idx ? 'bg-emerald-600 text-white shadow-xs' : (isDarkMode ? 'bg-[#050914] text-slate-400 hover:text-slate-200 border border-slate-800' : 'bg-slate-100 text-slate-600 hover:bg-slate-200')}`}
                      >
                        Case {idx + 1}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-3 font-mono text-xs">
                    <div>
                      <p className="text-slate-500 text-[11px] font-bold mb-1">Input:</p>
                      <div className={`p-2.5 rounded-xl border font-bold whitespace-pre-wrap ${isDarkMode ? 'bg-[#050914] border-slate-800 text-emerald-400' : 'bg-slate-50 border-slate-200 text-slate-900'}`}>
                        {problem.examples?.[selectedCase]?.input || 'No sample input available'}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {isRunning ? (
                    <div className="flex items-center gap-2 text-slate-400 animate-pulse pt-2">
                      <div className="w-3.5 h-3.5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                      <span>Executing code...</span>
                    </div>
                  ) : testResult ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-black uppercase ${getVerdictStyle(testResult.status)}`}>
                          {testResult.status}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          Runtime: {testResult.runtime !== undefined ? `${testResult.runtime} ms` : 'N/A'}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          Memory: {testResult.memory !== undefined ? `${testResult.memory} MB` : 'N/A'}
                        </span>
                      </div>
                      <div className={`p-3 rounded-xl border font-mono text-xs space-y-1 ${isDarkMode ? 'bg-[#050914] border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                        <p className="text-slate-500">Output = <span className="text-slate-200 font-bold">{testResult.output}</span></p>
                        <p className="text-slate-500">Expected = <span className={isDarkMode ? 'text-slate-300' : 'text-slate-900'}>{testResult.expected}</span></p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 font-medium pt-2">Click "Run" or "Submit" to view execution results.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AI Assistant Drawer */}
      <AIAssistantDrawer
        isOpen={isAIDrawerOpen}
        onClose={() => setIsAIDrawerOpen(false)}
        problem={problem}
        currentCode={code}
        language={language}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default ProblemDetails;