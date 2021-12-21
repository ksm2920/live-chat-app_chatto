import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AgentPage from './components/AgentPage';
import ChatModal from './components/ChatModal';
import Home from './components/Home';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/agent" element={<AgentPage />} />
        </Routes>
      </BrowserRouter>
      <ChatModal />
    </div>
  );
}

export default App;
