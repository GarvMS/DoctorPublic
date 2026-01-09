import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, AlertCircle, CheckCircle, Clock, User, FileText, Activity, ChevronRight, Send, Lightbulb, TrendingUp } from 'lucide-react';

// Sample patient data
const SAMPLE_PATIENTS = [
  {
    id: 1,
    name: "Rajesh Kumar",
    age: 58,
    riskLevel: "high",
    conditions: ["Type 2 Diabetes", "Hypertension"],
    lastVisit: "2024-12-15",
    appointmentTime: "9:00 AM",
    vitals: { bp: "145/92", glucose: "180 mg/dL", weight: "78 kg" },
    previousVisits: [
      { date: "2024-12-15", complaints: "Frequent urination, fatigue", diagnosis: "Uncontrolled diabetes" },
      { date: "2024-11-20", complaints: "Headache, dizziness", diagnosis: "Hypertension monitoring" }
    ]
  },
  {
    id: 2,
    name: "Priya Sharma",
    age: 45,
    riskLevel: "high",
    conditions: ["Asthma", "Allergies"],
    lastVisit: "2024-12-10",
    appointmentTime: "9:30 AM",
    vitals: { bp: "130/85", spo2: "94%", weight: "62 kg" },
    previousVisits: [
      { date: "2024-12-10", complaints: "Shortness of breath", diagnosis: "Asthma exacerbation" }
    ]
  },
  {
    id: 3,
    name: "Amit Patel",
    age: 35,
    riskLevel: "medium",
    conditions: ["Seasonal allergies"],
    lastVisit: "2024-11-25",
    appointmentTime: "10:00 AM",
    vitals: { bp: "120/80", weight: "70 kg" }
  },
  {
    id: 4,
    name: "Sunita Reddy",
    age: 28,
    riskLevel: "low",
    conditions: [],
    lastVisit: "2024-10-15",
    appointmentTime: "10:30 AM",
    vitals: { bp: "115/75", weight: "58 kg" }
  },
  {
    id: 5,
    name: "Mohammed Ali",
    age: 62,
    riskLevel: "high",
    conditions: ["CAD", "Type 2 Diabetes"],
    lastVisit: "2024-12-18",
    appointmentTime: "11:00 AM",
    vitals: { bp: "150/95", glucose: "195 mg/dL", weight: "85 kg" },
    previousVisits: [
      { date: "2024-12-18", complaints: "Chest discomfort", diagnosis: "Stable angina" }
    ]
  }
];

const DoctorAssistantApp = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [liveSuggestions, setLiveSuggestions] = useState([]);
  const [askedTopics, setAskedTopics] = useState(new Set());
  const [consultationSummary, setConsultationSummary] = useState(null);
  const conversationEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const startConsultation = (patient) => {
    setSelectedPatient(patient);
    setCurrentView('consultation');
    setConversation([]);
    setAskedTopics(new Set());
    setLiveSuggestions([]);
    setConsultationSummary(null);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // When starting recording, focus input
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  // Simulate AI analysis of conversation to generate suggestions
  const analyzeConversationAndSuggest = async (newConversation) => {
    setIsProcessing(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Extract topics that have been discussed
    const conversationText = newConversation.map(m => m.text.toLowerCase()).join(' ');
    const topics = new Set(askedTopics);

    // Check what's been asked
    if (conversationText.includes('medication') || conversationText.includes('medicine')) topics.add('medication');
    if (conversationText.includes('diet') || conversationText.includes('food') || conversationText.includes('eating')) topics.add('diet');
    if (conversationText.includes('exercise') || conversationText.includes('physical activity')) topics.add('exercise');
    if (conversationText.includes('glucose') || conversationText.includes('blood sugar')) topics.add('glucose_monitoring');
    if (conversationText.includes('vision') || conversationText.includes('eyes') || conversationText.includes('see')) topics.add('vision');
    if (conversationText.includes('foot') || conversationText.includes('feet') || conversationText.includes('toes')) topics.add('foot_care');
    if (conversationText.includes('symptoms') || conversationText.includes('feeling')) topics.add('symptoms');
    if (conversationText.includes('thirst') || conversationText.includes('urination') || conversationText.includes('bathroom')) topics.add('polyuria');
    if (conversationText.includes('wound') || conversationText.includes('cut') || conversationText.includes('heal')) topics.add('wound_healing');
    if (conversationText.includes('stress') || conversationText.includes('anxiety')) topics.add('mental_health');

    setAskedTopics(topics);

    // Generate suggestions based on patient profile and what hasn't been asked
    const suggestions = [];
    const patientConditions = selectedPatient?.conditions || [];

    if (patientConditions.includes('Type 2 Diabetes')) {
      if (!topics.has('glucose_monitoring')) {
        suggestions.push({
          priority: 'high',
          question: 'Have you been monitoring your blood glucose levels at home? What are the typical readings?',
          reason: 'Critical for diabetes management - previous visit showed uncontrolled levels (180 mg/dL)',
          category: 'Diabetes Monitoring'
        });
      }
      if (!topics.has('vision')) {
        suggestions.push({
          priority: 'high',
          question: 'Have you noticed any changes in your vision, such as blurriness or difficulty seeing at night?',
          reason: 'Diabetic retinopathy screening - essential for long-term diabetes patients',
          category: 'Complications Screening'
        });
      }
      if (!topics.has('foot_care')) {
        suggestions.push({
          priority: 'high',
          question: 'Any numbness, tingling, or pain in your feet? Have you noticed any wounds or sores?',
          reason: 'Patient mentioned feet tingling - possible diabetic neuropathy',
          category: 'Neuropathy Assessment'
        });
      }
      if (!topics.has('polyuria')) {
        suggestions.push({
          priority: 'medium',
          question: 'Are you experiencing increased thirst or more frequent urination than usual?',
          reason: 'Classic symptoms of uncontrolled diabetes',
          category: 'Symptom Assessment'
        });
      }
      if (!topics.has('wound_healing')) {
        suggestions.push({
          priority: 'medium',
          question: 'Have you noticed any cuts or wounds that seem to be healing slower than normal?',
          reason: 'Poor wound healing is an indicator of diabetes control',
          category: 'Complications Screening'
        });
      }
      if (!topics.has('diet') && conversation.length > 2) {
        suggestions.push({
          priority: 'medium',
          question: 'Walk me through what you typically eat in a day. Are you following the diabetic diet plan?',
          reason: 'Diet is crucial for diabetes management',
          category: 'Lifestyle Factors'
        });
      }
      if (!topics.has('exercise') && conversation.length > 4) {
        suggestions.push({
          priority: 'low',
          question: 'How much physical activity are you getting each week?',
          reason: 'Exercise improves insulin sensitivity',
          category: 'Lifestyle Factors'
        });
      }
    }

    if (patientConditions.includes('Hypertension')) {
      if (!topics.has('medication') && conversation.length > 2) {
        suggestions.push({
          priority: 'high',
          question: 'Are you taking your blood pressure medications as prescribed? Any side effects?',
          reason: 'BP reading today is 145/92 - slightly elevated',
          category: 'Medication Adherence'
        });
      }
      if (!topics.has('stress')) {
        suggestions.push({
          priority: 'medium',
          question: 'How have your stress levels been? Any major life changes or concerns?',
          reason: 'Stress can significantly impact blood pressure',
          category: 'Psychosocial Factors'
        });
      }
    }

    // Always suggest reviewing previous visit findings if not discussed
    if (conversation.length > 3 && !conversationText.includes('last visit') && !conversationText.includes('previous')) {
      suggestions.push({
        priority: 'medium',
        question: 'Since your last visit, have the symptoms we discussed then improved, stayed the same, or worsened?',
        reason: 'Follow-up on previous visit concerns (uncontrolled diabetes)',
        category: 'Follow-up'
      });
    }

    // Sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    suggestions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

    setLiveSuggestions(suggestions.slice(0, 5)); // Show top 5 suggestions
    setIsProcessing(false);
  };

  const handleSendMessage = async (speaker, message) => {
    if (!message.trim()) return;

    const newMessage = {
      speaker,
      text: message,
      timestamp: new Date().toISOString()
    };

    const updatedConversation = [...conversation, newMessage];
    setConversation(updatedConversation);

    // Only clear current input if it's the doctor speaking
    if (speaker === 'Doctor') {
      setCurrentInput('');
    }

    // Analyze conversation after any message
    await analyzeConversationAndSuggest(updatedConversation);
  };

  const useSuggestedQuestion = (question) => {
    setCurrentInput(question);
    inputRef.current?.focus();
  };

  const endConsultation = async () => {
    setIsProcessing(true);
    
    // Generate final consultation summary
    await new Promise(resolve => setTimeout(resolve, 1500));

    const summary = {
      discussedTopics: Array.from(askedTopics),
      missedCriticalAreas: liveSuggestions
        .filter(s => s.priority === 'high')
        .map(s => s.category),
      keyFindings: [
        "Patient reports medication non-adherence (missing doses)",
        "Peripheral symptoms suggest possible diabetic neuropathy",
        "Current glucose levels remain elevated at 180 mg/dL",
        "Diet and lifestyle modification needed"
      ],
      recommendedActions: [
        {
          action: "Order HbA1c test and comprehensive metabolic panel",
          urgency: "Within 1 week",
          reason: "Assess long-term glucose control"
        },
        {
          action: "Refer to endocrinologist for medication adjustment",
          urgency: "Within 2 weeks",
          reason: "Persistent hyperglycemia despite current regimen"
        },
        {
          action: "Schedule diabetic neuropathy assessment",
          urgency: "Within 1 month",
          reason: "Patient reporting peripheral tingling symptoms"
        },
        {
          action: "Arrange diabetic educator consultation",
          urgency: "Within 2 weeks",
          reason: "Reinforce medication adherence and lifestyle modifications"
        }
      ],
      clinicalPathways: [
        {
          pathway: "Uncontrolled Type 2 Diabetes",
          actions: ["Adjust oral hypoglycemics", "Consider insulin therapy", "Dietary counseling"]
        },
        {
          pathway: "Suspected Diabetic Neuropathy",
          actions: ["Nerve conduction studies", "Monofilament test", "Pain management plan"]
        }
      ]
    };

    setConsultationSummary(summary);
    setIsRecording(false);
    setIsProcessing(false);
  };

  const getRiskColor = (risk) => {
    switch(risk) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getRiskIcon = (risk) => {
    switch(risk) {
      case 'high': return <AlertCircle className="w-5 h-5" />;
      case 'medium': return <Clock className="w-5 h-5" />;
      case 'low': return <CheckCircle className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-50 border-red-300 text-red-900';
      case 'medium': return 'bg-yellow-50 border-yellow-300 text-yellow-900';
      case 'low': return 'bg-blue-50 border-blue-300 text-blue-900';
      default: return 'bg-gray-50 border-gray-300 text-gray-900';
    }
  };

  // Dashboard View
  const DashboardView = () => (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Doctor Assistant Dashboard</h1>
        <p className="text-gray-600">Today's Appointments - January 8, 2026</p>
      </div>

      {/* Risk Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-600 text-sm font-medium">High Risk</p>
              <p className="text-3xl font-bold text-red-900">{SAMPLE_PATIENTS.filter(p => p.riskLevel === 'high').length}</p>
            </div>
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
        </div>
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-600 text-sm font-medium">Medium Risk</p>
              <p className="text-3xl font-bold text-yellow-900">{SAMPLE_PATIENTS.filter(p => p.riskLevel === 'medium').length}</p>
            </div>
            <Clock className="w-10 h-10 text-yellow-500" />
          </div>
        </div>
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Low Risk</p>
              <p className="text-3xl font-bold text-green-900">{SAMPLE_PATIENTS.filter(p => p.riskLevel === 'low').length}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
        </div>
      </div>

      {/* Patient List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Patient Queue</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {SAMPLE_PATIENTS.map(patient => (
            <div key={patient.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getRiskColor(patient.riskLevel)} flex items-center space-x-1`}>
                        {getRiskIcon(patient.riskLevel)}
                        <span className="uppercase">{patient.riskLevel} Risk</span>
                      </span>
                    </div>
                    <div className="flex items-center space-x-6 text-sm text-gray-600">
                      <span>Age: {patient.age}</span>
                      <span>Time: {patient.appointmentTime}</span>
                      <span>Last Visit: {patient.lastVisit}</span>
                    </div>
                    {patient.conditions.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {patient.conditions.map((condition, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {condition}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {patient.riskLevel === 'high' && (
                    <button
                      onClick={() => startConsultation(patient)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    >
                      <Mic className="w-4 h-4" />
                      <span>Start Voice Consultation</span>
                    </button>
                  )}
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Consultation View
  const ConsultationView = () => (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => setCurrentView('dashboard')}
          className="text-blue-600 hover:text-blue-700 mb-4"
        >
          ← Back to Dashboard
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Voice Consultation</h1>
            <p className="text-gray-600">Patient: {selectedPatient?.name}</p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getRiskColor(selectedPatient?.riskLevel)} flex items-center space-x-2`}>
            {getRiskIcon(selectedPatient?.riskLevel)}
            <span className="uppercase">{selectedPatient?.riskLevel} Risk Patient</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Column - Patient History (3 cols) */}
        <div className="col-span-3 space-y-4">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Patient History
            </h3>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-gray-600">Age</p>
                <p className="font-medium">{selectedPatient?.age} years</p>
              </div>
              <div>
                <p className="text-gray-600">Conditions</p>
                {selectedPatient?.conditions.map((c, i) => (
                  <p key={i} className="font-medium">{c}</p>
                ))}
              </div>
              <div>
                <p className="text-gray-600">Last Visit</p>
                <p className="font-medium">{selectedPatient?.lastVisit}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Current Vitals</h3>
            <div className="space-y-2 text-sm">
              {Object.entries(selectedPatient?.vitals || {}).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-gray-600 capitalize">{key}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Previous Visits</h3>
            <div className="space-y-3">
              {selectedPatient?.previousVisits?.map((visit, idx) => (
                <div key={idx} className="text-sm border-l-2 border-blue-500 pl-3">
                  <p className="text-gray-600">{visit.date}</p>
                  <p className="font-medium text-gray-900">{visit.complaints}</p>
                  <p className="text-gray-500 text-xs mt-1">{visit.diagnosis}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Column - Conversation (5 cols) */}
        <div className="col-span-5 space-y-4">
          <div className="bg-white rounded-lg shadow-md p-6 flex flex-col h-[calc(100vh-280px)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 text-lg">Live Consultation</h3>
              <div className="flex items-center space-x-3">
                {isRecording && (
                  <div className="flex items-center space-x-2 px-3 py-1 bg-red-50 border border-red-200 rounded-lg">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-red-700 text-sm font-medium">Recording</span>
                  </div>
                )}
                <button
                  onClick={toggleRecording}
                  className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                    isRecording 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {isRecording ? (
                    <>
                      <MicOff className="w-4 h-4" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4" />
                      <span>Start</span>
                    </>
                  )}
                </button>
                {conversation.length > 0 && (
                  <button
                    onClick={endConsultation}
                    disabled={isProcessing}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:bg-gray-400"
                  >
                    End Consultation
                  </button>
                )}
              </div>
            </div>

            {/* Conversation Display */}
            <div className="flex-1 bg-gray-50 rounded-lg p-4 overflow-y-auto mb-4">
              {conversation.length === 0 ? (
                <div className="text-center text-gray-500 mt-20">
                  <Mic className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>Click "Start" to begin the consultation</p>
                  <p className="text-sm mt-2">You can type or use voice to interact</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {conversation.map((item, idx) => (
                    <div key={idx} className={`flex ${item.speaker === 'Doctor' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] p-3 rounded-lg ${
                        item.speaker === 'Doctor' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white border border-gray-200 text-gray-900'
                      }`}>
                        <p className="text-xs font-semibold mb-1 opacity-75">{item.speaker}</p>
                        <p className="text-sm">{item.text}</p>
                      </div>
                    </div>
                  ))}
                  {isProcessing && (
                    <div className="flex justify-center">
                      <div className="bg-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600">
                        AI analyzing conversation...
                      </div>
                    </div>
                  )}
                  <div ref={conversationEndRef} />
                </div>
              )}
            </div>

            {/* Input Area */}
            {isRecording && !consultationSummary && (
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey && currentInput.trim()) {
                        e.preventDefault();
                        handleSendMessage('Doctor', currentInput);
                      }
                    }}
                    placeholder="Type doctor's question or response..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isProcessing}
                  />
                  <button
                    onClick={() => handleSendMessage('Doctor', currentInput)}
                    disabled={!currentInput.trim() || isProcessing}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    id="patient-input"
                    placeholder="Simulate patient response (optional)..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    disabled={isProcessing}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey && e.target.value.trim()) {
                        e.preventDefault();
                        handleSendMessage('Patient', e.target.value);
                        e.target.value = '';
                      }
                    }}
                  />
                  <button
                    onClick={(e) => {
                      const input = document.getElementById('patient-input');
                      if (input.value.trim()) {
                        handleSendMessage('Patient', input.value);
                        input.value = '';
                      }
                    }}
                    disabled={isProcessing}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - AI Suggestions (4 cols) */}
        <div className="col-span-4 space-y-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold text-gray-900 text-lg mb-4 flex items-center">
              <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
              Live AI Suggestions
            </h3>

            {!isRecording && conversation.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">Start the consultation to see AI-powered suggestions</p>
              </div>
            )}

            {isRecording && liveSuggestions.length === 0 && !isProcessing && (
              <div className="text-center text-gray-500 py-8">
                <TrendingUp className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">Continue the conversation...</p>
                <p className="text-xs mt-2">AI will suggest questions as you progress</p>
              </div>
            )}

            {isProcessing && (
              <div className="text-center text-gray-500 py-8">
                <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-3"></div>
                <p className="text-sm">Analyzing conversation...</p>
              </div>
            )}

            {liveSuggestions.length > 0 && (
              <div className="space-y-3">
                {liveSuggestions.map((suggestion, idx) => (
                  <div 
                    key={idx}
                    className={`border-2 rounded-lg p-4 transition-all hover:shadow-md ${getPriorityColor(suggestion.priority)}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className={`text-xs font-semibold uppercase px-2 py-1 rounded ${
                        suggestion.priority === 'high' ? 'bg-red-200 text-red-900' :
                        suggestion.priority === 'medium' ? 'bg-yellow-200 text-yellow-900' :
                        'bg-blue-200 text-blue-900'
                      }`}>
                        {suggestion.priority} Priority
                      </span>
                      <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded">
                        {suggestion.category}
                      </span>
                    </div>
                    <p className="text-sm font-medium mb-2">{suggestion.question}</p>
                    <p className="text-xs text-gray-700 mb-3 italic">
                      Why: {suggestion.reason}
                    </p>
                    <button
                      onClick={() => useSuggestedQuestion(suggestion.question)}
                      className="text-xs bg-white hover:bg-gray-100 text-gray-800 px-3 py-1 rounded border border-gray-300 transition-colors w-full"
                    >
                      Use This Question
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Consultation Summary */}
          {consultationSummary && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-gray-900 text-lg mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                Consultation Summary
              </h3>

              <div className="space-y-4">
                {/* Discussed Topics */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Topics Covered</h4>
                  <div className="flex flex-wrap gap-2">
                    {consultationSummary.discussedTopics.map((topic, idx) => (
                      <span key={idx} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                        {topic.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Missed Critical Areas */}
                {consultationSummary.missedCriticalAreas.length > 0 && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded">
                    <h4 className="text-sm font-semibold text-red-900 mb-2 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      Missed Critical Areas
                    </h4>
                    <ul className="text-xs text-red-800 space-y-1">
                      {consultationSummary.missedCriticalAreas.map((area, idx) => (
                        <li key={idx}>• {area}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Key Findings */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Key Findings</h4>
                  <ul className="text-xs text-gray-700 space-y-1">
                    {consultationSummary.keyFindings.map((finding, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                        <span>{finding}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommended Actions */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Recommended Actions</h4>
                  <div className="space-y-2">
                    {consultationSummary.recommendedActions.map((action, idx) => (
                      <div key={idx} className="p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                        <p className="font-medium text-blue-900">{action.action}</p>
                        <p className="text-blue-700 mt-1">
                          <span className="font-semibold">Timeline:</span> {action.urgency}
                        </p>
                        <p className="text-blue-600 mt-1 italic">{action.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Clinical Pathways */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">Clinical Pathways</h4>
                  <div className="space-y-2">
                    {consultationSummary.clinicalPathways.map((pathway, idx) => (
                      <div key={idx} className="p-2 border border-gray-200 rounded text-xs">
                        <p className="font-semibold text-gray-900 mb-1">{pathway.pathway}</p>
                        <ul className="text-gray-700">
                          {pathway.actions.map((action, aidx) => (
                            <li key={aidx}>• {action}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {currentView === 'dashboard' ? <DashboardView /> : <ConsultationView />}
    </div>
  );
};

export default DoctorAssistantApp;
