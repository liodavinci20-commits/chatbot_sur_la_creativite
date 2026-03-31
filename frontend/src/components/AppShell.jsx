// AppShell.jsx — Layout partagé (TopBar + [Sidebar optionnel] + Main + Chat)
import TopBar from './TopBar'

export default function AppShell({
    user,
    currentStep = 1,
    completedSteps = [],
    sidebarContent,
    chatContent,
    children,
}) {
    const hasSidebar = !!sidebarContent

    return (
        <div className={`v2-app ${hasSidebar ? '' : 'v2-app--no-sidebar'}`}>
            {/* Top Bar */}
            <TopBar
                user={user}
                currentStep={currentStep}
                completedSteps={completedSteps}
            />

            {/* Sidebar (optionnel) */}
            {sidebarContent}

            {/* Main Content */}
            <div className="v2-main">
                <div className="v2-main-scroll">
                    {children}
                </div>
            </div>

            {/* Chat Panel */}
            {chatContent}
        </div>
    )
}
