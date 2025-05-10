import React from "react";

const Homepage = ({ roomId, setRoomId, userName, setUserName, createRoomId, joinRoom }) => {
  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-hidden">
      {/* Custom CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          33% { transform: translateY(-15px) translateX(5px); }
          66% { transform: translateY(5px) translateX(-5px); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes type {
          from { width: 0; }
          to { width: 100%; }
        }
        
        @keyframes count-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animate-type {
          animation: type 2s steps(40) forwards;
          overflow: hidden;
          white-space: nowrap;
          width: 0;
        }
        
        .animate-count-up {
          animation: count-up 0.8s ease-out forwards;
        }
      `}</style>
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      
      {/* Gradient Overlays */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>

      {/* Navigation */}
      <nav className="relative z-50 px-6 py-4 border-b border-gray-800/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              JudgeDesK
            </span>
          </div>
        </div>
      </nav>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-400/30 rounded-full animate-float-slow"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-purple-400/40 rounded-full animate-float-slow" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-green-400/20 rounded-full animate-float-slow" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-yellow-400/30 rounded-full animate-float-slow" style={{animationDelay: '3s'}}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Room Entry Form */}
        <div className="pt-20 pb-16 flex items-center justify-center min-h-screen">
          <div className="w-full max-w-md">
            <div className="text-center mb-8 animate-fade-in">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-float">
                <svg className="w-8 h-8 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m13 0h-6m-2-5h6m2 5v6a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v1" />
                </svg>
              </div>
              
              <h2 className="text-3xl font-bold mb-2 animate-slide-up">Join Code Room</h2>
              <p className="text-gray-400 animate-slide-up" style={{animationDelay: '0.2s'}}>Enter your details to start coding together</p>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 backdrop-blur-sm animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              <div className="space-y-6">
                {/* Room ID Input */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-300 mb-2 transition-colors group-focus-within:text-blue-400">Room ID</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Room Id"
                      value={roomId}
                      onChange={(e) => setRoomId(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-600"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-focus-within:from-blue-500/10 group-focus-within:to-purple-500/10 transition-all duration-300 pointer-events-none"></div>
                  </div>
                  <button 
                    onClick={createRoomId}
                    className="mt-3 w-full py-2 text-sm bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95"
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span>Create ID</span>
                    </span>
                  </button>
                </div>

                {/* Name Input */}
                <div className="group">
                  <label className="block text-sm font-medium text-gray-300 mb-2 transition-colors group-focus-within:text-blue-400">Your Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-600"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-focus-within:from-blue-500/10 group-focus-within:to-purple-500/10 transition-all duration-300 pointer-events-none"></div>
                  </div>
                </div>

                {/* Join Button */}
                <button 
                  onClick={joinRoom}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none active:scale-95"
                  disabled={!roomId.trim() || !userName.trim()}
                >
                  <span className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    <span>Join Room</span>
                  </span>
                </button>
              </div>

              {/* Help Text */}
              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl animate-fade-in" style={{animationDelay: '0.6s'}}>
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm text-blue-300">
                    <p className="font-medium mb-1">Ready to code?</p>
                    <p className="text-blue-400">Create a new room ID or enter an existing one to start collaborative coding with your team.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Preview Below Form */}
            <div className="mt-12 space-y-8 animate-fade-in" style={{animationDelay: '0.8s'}}>
              {/* Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="group bg-gray-900/30 border border-gray-800/50 rounded-xl p-4 backdrop-blur-sm hover:bg-gray-800/40 transition-all duration-300 hover:scale-105 hover:border-blue-500/30">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                      <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold">Real-time Coding</h3>
                      <p className="text-xs text-gray-400">Live collaboration</p>
                    </div>
                  </div>
                </div>

                <div className="group bg-gray-900/30 border border-gray-800/50 rounded-xl p-4 backdrop-blur-sm hover:bg-gray-800/40 transition-all duration-300 hover:scale-105 hover:border-purple-500/30" style={{animationDelay: '0.9s'}}>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                      <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold">Video Chat</h3>
                      <p className="text-xs text-gray-400">Face-to-face coding</p>
                    </div>
                  </div>
                </div>

                <div className="group bg-gray-900/30 border border-gray-800/50 rounded-xl p-4 backdrop-blur-sm hover:bg-gray-800/40 transition-all duration-300 hover:scale-105 hover:border-green-500/30" style={{animationDelay: '1s'}}>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold">Live Chat</h3>
                      <p className="text-xs text-gray-400">Instant messaging</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex justify-center items-center space-x-8 py-6 animate-fade-in" style={{animationDelay: '1.2s'}}>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400 animate-count-up">1K+</div>
                  <div className="text-xs text-gray-500">Active Rooms</div>
                </div>
                <div className="w-px h-8 bg-gray-800"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400 animate-count-up">50+</div>
                  <div className="text-xs text-gray-500">Languages</div>
                </div>
                <div className="w-px h-8 bg-gray-800"></div>
                <div className="text-center">  
                  <div className="text-2xl font-bold text-green-400 animate-count-up">24/7</div>
                  <div className="text-xs text-gray-500">Available</div>
                </div>
              </div>

              {/* Floating Code Snippets */}
              <div className="relative overflow-hidden rounded-xl bg-gray-900/30 border border-gray-800/50 p-6 backdrop-blur-sm animate-fade-in" style={{animationDelay: '1.4s'}}>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-400 ml-2">code-room.js</span>
                </div>
                <div className="font-mono text-sm space-y-1 overflow-hidden">
                  <div className="text-purple-400 animate-type" style={{animationDelay: '1.6s'}}>const room = new CodeRoom();</div>
                  <div className="text-blue-400 animate-type" style={{animationDelay: '1.8s'}}>room.connect(roomId);</div>
                  <div className="text-green-400 animate-type" style={{animationDelay: '2s'}}>// Start coding together! 🚀</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;