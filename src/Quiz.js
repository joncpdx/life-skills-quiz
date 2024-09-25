import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

const allQuestions = {
  receivingLove: {
    developed: [
      "I believe my physical needs are important",
      "I can comfort and calm myself when I am upset",
      "I can communicate my needs to others, even if it's inconvenient",
      "I take care of my body",
      "I believe I'm a beloved child of God"
    ],
    underdeveloped: [
      "I worry that people might abandon me",
      "I avoid getting emotionally close to others",
      "I avoid being vulnerable and receiving help",
      "I feel shame about myself",
      "I have negative thoughts about myself"
    ]
  },
  // ... (other skills remain the same)
};

const skillNames = {
  receivingLove: "Receiving Love",
  exploringPlayfully: "Exploring Playfully",
  thinkingForYourself: "Thinking for Yourself",
  initiatingPower: "Initiating Power",
  expandingCompetence: "Expanding Competence",
  increasingResponsibility: "Increasing Responsibility",
  expandingLove: "Expanding Love"
};

const skillDescriptions = {
  receivingLove: "I can receive love because I am loved just as I am",
  exploringPlayfully: "I can try new behaviors because I am protected",
  thinkingForYourself: "I can become my own person as I remain connected to others",
  initiatingPower: "I can use my power for healthy relationships",
  expandingCompetence: "I can grow my competence in new environments",
  increasingResponsibility: "I can manage my internal world and behavior",
  expandingLove: "I can meet my needs and honor the needs of others"
};

const StarRating = ({ rating }) => {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={24}
          fill={star <= rating ? "#FFD700" : "none"}
          stroke={star <= rating ? "#FFD700" : "#CBD5E0"}
        />
      ))}
    </div>
  );
};

const Quiz = () => {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const questions = useMemo(() => {
    const selectedQuestions = [];
    Object.keys(allQuestions).forEach(skill => {
      allQuestions[skill].developed.forEach(q => selectedQuestions.push({ text: q, skill, positive: true }));
      allQuestions[skill].underdeveloped.forEach(q => selectedQuestions.push({ text: q, skill, positive: false }));
    });
    return selectedQuestions.sort(() => 0.5 - Math.random());
  }, []);

  const handleStart = () => {
    setQuizStarted(true);
    setAnswers(Array(questions.length).fill(0));
  };

  const handleRestart = useCallback(() => {
    setQuizStarted(false);
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
    setSelectedAnswer(null);
  }, []);

  const handleAnswer = useCallback((value) => {
    setSelectedAnswer(value);
    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[currentQuestion] = value;
      return newAnswers;
    });

    setTimeout(() => {
      setSelectedAnswer(null);
      setCurrentQuestion(prev => {
        if (prev < questions.length - 1) {
          return prev + 1;
        } else {
          setShowResult(true);
          return prev;
        }
      });
    }, 300);
  }, [currentQuestion, questions.length]);

  const handleRandomCompletion = useCallback(() => {
    setAnswers(prev => {
      const newAnswers = [...prev];
      for (let i = currentQuestion; i < questions.length; i++) {
        newAnswers[i] = Math.floor(Math.random() * 4) + 1;
      }
      return newAnswers;
    });
    setShowResult(true);
  }, [currentQuestion, questions.length]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === '1' && event.shiftKey) {
        handleRestart();
      } else if (quizStarted && !showResult) {
        if (event.key >= '1' && event.key <= '4') {
          handleAnswer(parseInt(event.key));
        } else if (event.key === 'Enter' && event.shiftKey) {
          handleRandomCompletion();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [quizStarted, showResult, handleAnswer, handleRandomCompletion, handleRestart]);

  const calculateScore = (skill) => {
    return questions.reduce((total, question, index) => {
      if (question.skill === skill) {
        return question.positive ? total + answers[index] : total - answers[index];
      }
      return total;
    }, 0);
  };

  const getStarRating = (score) => {
    if (score > 6) return 5;
    if (score > 4) return 4;
    if (score > 2) return 3;
    if (score > 0) return 2;
    return 1;
  };

  const getScoreCategory = (score) => {
    if (score > 6) return "Excellent";
    if (score > 4) return "Very Good";
    if (score > 2) return "Good";
    if (score > 0) return "Fair";
    return "Needs Improvement";
  };

  const renderIntro = () => (
    <Card className="bg-blue-50 shadow-lg">
      <CardContent className="pt-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-black">Which Developmental Skills are You Strong in?</h1>
        <div className="flex flex-col items-center mb-6">
          {Object.values(skillNames).map((skill, index) => (
            <h3 key={index} className="text-lg font-semibold mb-2 text-black">{skill}</h3>
          ))}
        </div>
        <Button onClick={handleStart} className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300">Take the Quiz</Button>
      </CardContent>
    </Card>
  );

  const renderQuestion = () => (
    <div className="p-4 sm:p-6 md:p-8 max-w-2xl mx-auto">
      <div className="w-full h-2 bg-blue-200 rounded-full mb-4">
        <div 
          className="h-full bg-blue-600 rounded-full transition-all duration-300 ease-in-out" 
          style={{ width: `${(currentQuestion + 1) / questions.length * 100}%` }}
        ></div>
      </div>
      <Card className="bg-blue-50 shadow-lg">
        <CardContent className="pt-6">
          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-600 mb-2">
            Question {currentQuestion + 1} of {questions.length}
          </h3>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-black leading-tight">
            {questions[currentQuestion].text}
          </h1>
          <div className="flex flex-wrap justify-center gap-8 mb-6">
            {[
              { value: 1, label: 'Never' },
              { value: 2, label: 'A little' },
              { value: 3, label: 'Regularly' },
              { value: 4, label: 'A lot' }
            ].map(({ value, label }) => (
              <div key={value} className="flex flex-col items-center">
                <Button 
                  onClick={() => handleAnswer(value)}
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white text-black border-2 border-black transition-all duration-300 ease-in-out text-lg sm:text-xl font-semibold mb-2
                              ${selectedAnswer === value ? 'bg-blue-600 text-white' : 'hover:bg-blue-100'}`}
                >
                  {value}
                </Button>
                <span className="text-xs sm:text-sm text-gray-600 text-center">{label}</span>
              </div>
            ))}
          </div>
          <p className="text-center text-sm sm:text-base text-gray-600 mt-4">
            Press 1-4 on your keyboard to answer, or Shift+Enter to complete randomly
          </p>
        </CardContent>
      </Card>
    </div>
  );

  const renderResult = () => {
    const results = Object.keys(skillNames).map(skill => ({
      skill: skillNames[skill],
      description: skillDescriptions[skill],
      starRating: getStarRating(calculateScore(skill)),
      category: getScoreCategory(calculateScore(skill))
    }));

    return (
      <Card className="bg-blue-50 shadow-lg">
        <CardContent className="pt-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-center text-black">Your Results</h1>
          {results.map(({ skill, description, starRating, category }, index) => (
            <div key={index} className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl sm:text-2xl font-semibold text-black">{skill}</h2>
                <StarRating rating={starRating} />
              </div>
              <p className="mb-2 italic text-gray-700">{description}</p>
              <p className="mb-2 text-black">Your skill level: <span className="font-bold">{category}</span></p>
              <p className="text-gray-700">
                {category === "Excellent" ? `You have a well-developed skill in ${skill}. Keep nurturing this strength.` :
                 category === "Very Good" ? `You have a strong foundation in ${skill}. There's still room for growth.` :
                 category === "Good" ? `You have a good base in ${skill}. Consider ways to further develop this area.` :
                 category === "Fair" ? `Your skill in ${skill} could use some development. Focus on improving this area.` :
                 `You may want to prioritize developing your skill in ${skill}. Consider seeking support or resources to help you in this area.`}
              </p>
            </div>
          ))}
          <p className="text-center text-sm sm:text-base text-gray-600 mt-4">
            Press Shift+1 to restart the quiz
          </p>
        </CardContent>
      </Card>
    );
  };

  if (!quizStarted) {
    return renderIntro();
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-black">Life Skills Quiz</h1>
      {showResult ? renderResult() : renderQuestion()}
    </div>
  );
};

export default Quiz;
