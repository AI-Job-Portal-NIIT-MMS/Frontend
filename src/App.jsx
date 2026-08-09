import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
/* CSS Files */
import './styles/global.css';
/* Components */
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { Toast } from './components/Toast';
/* Pages */
import { LandingPage } from './pages/LandingPage';
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';
import { DashboardPage } from './pages/DashboardPage';
import { JobsPage } from './pages/JobsPage';
import { JobDetailPage } from './pages/JobDetailPage';
import { AIMatchPage } from './pages/AIMatchPage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { InterviewsPage } from './pages/InterviewsPage';
import { ProfilePage } from './pages/ProfilePage';
import { PostJobPage } from './pages/PostJobPage';
import { SavedJobsPage } from './pages/SavedJobsPage';
import { ResumeBuilderPage } from './pages/ResumeBuilderPage';
import { MessagesPage } from './pages/MessagesPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { SettingsPage } from './pages/SettingsPage';
const AppLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    return (<div className="app-layout">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)}/>
      <div className="main-wrapper">
        <Topbar onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}/>
        <main className="page-container">{children}</main>
      </div>
    </div>);
};
export const AppContent = () => {
    return (<BrowserRouter>
      <Toast />
      <Routes>
        {/* Public Marketing & Auth Pages */}
        <Route path="/" element={<LandingPage />}/>
        <Route path="/signin" element={<SignInPage />}/>
        <Route path="/signup" element={<SignUpPage />}/>

        {/* Protected App Pages with Sidebar & Topbar */}
        <Route path="/dashboard" element={<AppLayout>
              <DashboardPage />
            </AppLayout>}/>
        <Route path="/jobs" element={<AppLayout>
              <JobsPage />
            </AppLayout>}/>
        <Route path="/job/:id" element={<AppLayout>
              <JobDetailPage />
            </AppLayout>}/>
        <Route path="/ai-match" element={<AppLayout>
              <AIMatchPage />
            </AppLayout>}/>
        <Route path="/applications" element={<AppLayout>
              <ApplicationsPage />
            </AppLayout>}/>
        <Route path="/interviews" element={<AppLayout>
              <InterviewsPage />
            </AppLayout>}/>
        <Route path="/profile" element={<AppLayout>
              <ProfilePage />
            </AppLayout>}/>
        <Route path="/post-job" element={<AppLayout>
              <PostJobPage />
            </AppLayout>}/>
        <Route path="/saved-jobs" element={<AppLayout>
              <SavedJobsPage />
            </AppLayout>}/>
        <Route path="/resume-builder" element={<AppLayout>
              <ResumeBuilderPage />
            </AppLayout>}/>
        <Route path="/messages" element={<AppLayout>
              <MessagesPage />
            </AppLayout>}/>
        <Route path="/notifications" element={<AppLayout>
              <NotificationsPage />
            </AppLayout>}/>
        <Route path="/settings" element={<AppLayout>
              <SettingsPage />
            </AppLayout>}/>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/dashboard" replace/>}/>
      </Routes>
    </BrowserRouter>);
};
export default function App() {
    return (<AppProvider>
      <AppContent />
    </AppProvider>);
}
