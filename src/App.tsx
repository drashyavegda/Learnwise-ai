import { Suspense, lazy } from 'react'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/Layout'
import { AppProvider } from './lib/store'
import { Button, Card } from './components/ui'

/**
 * Routes are lazy so the first paint on a phone does not download the charts
 * and the teacher dashboard before the student dashboard.
 */
const Landing = lazy(() => import('./pages/Landing'))
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'))
const Assessment = lazy(() => import('./pages/Assessment'))
const Results = lazy(() => import('./pages/Results'))
const Tutor = lazy(() => import('./pages/Tutor'))
const Practice = lazy(() => import('./pages/Practice'))
const LearningPath = lazy(() => import('./pages/LearningPath'))
const Revision = lazy(() => import('./pages/Revision'))
const Lessons = lazy(() => import('./pages/Lessons'))
const Achievements = lazy(() => import('./pages/Achievements'))
const Teacher = lazy(() => import('./pages/Teacher'))
const Planner = lazy(() => import('./pages/Planner'))
const Insights = lazy(() => import('./pages/Insights'))
const Parent = lazy(() => import('./pages/Parent'))
const Privacy = lazy(() => import('./pages/Privacy'))
const About = lazy(() => import('./pages/About'))

function Loading() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <div className="flex items-center gap-2.5 text-[13px] font-medium text-navy-400">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-navy-200 border-t-brand-teal" />
        Loading
      </div>
    </div>
  )
}

function NotFound() {
  return (
    <div className="grid min-h-[60vh] place-items-center px-4">
      <Card className="card-pad max-w-md text-center">
        <p className="label">404</p>
        <h1 className="mt-1 text-xl font-bold text-navy-900">That page is not part of the demo</h1>
        <p className="mt-1.5 text-[13px] leading-relaxed text-navy-500">
          The link may be old, or the page may belong to a part of the product this prototype does not include.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <Link to="/student">
            <Button size="sm">Student dashboard</Button>
          </Link>
          <Link to="/">
            <Button size="sm" variant="secondary">Home</Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route element={<AppShell />}>
              <Route path="/student" element={<StudentDashboard />} />
              <Route path="/student/assessment" element={<Assessment />} />
              <Route path="/student/results" element={<Results />} />
              <Route path="/student/tutor" element={<Tutor />} />
              <Route path="/student/practice" element={<Practice />} />
              <Route path="/student/path" element={<LearningPath />} />
              <Route path="/student/revision" element={<Revision />} />
              <Route path="/student/lessons" element={<Lessons />} />
              <Route path="/student/achievements" element={<Achievements />} />
              <Route path="/teacher" element={<Teacher />} />
              <Route path="/teacher/planner" element={<Planner />} />
              <Route path="/teacher/insights" element={<Insights />} />
              <Route path="/parent" element={<Parent />} />
              <Route path="/parent/privacy" element={<Privacy />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AppProvider>
  )
}
