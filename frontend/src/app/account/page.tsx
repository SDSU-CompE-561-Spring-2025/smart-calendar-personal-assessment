export default function AccountPage() {
    return (
        <div className="flex h-full w-full flex-col gap-4 p-4 lg:flex-row lg:gap-0 lg:p-0">
        
            <div className="flex h-full w-full flex-col gap-4 overflow-hidden rounded-lg border bg-background shadow-md lg:w-[calc(100%-var(--sidebar-width))] lg:rounded-none lg:border-none">
                <div className="flex h-full w-full flex-col gap-4 overflow-hidden rounded-lg border bg-background shadow-md lg:w-[calc(100%-var(--sidebar-width))] lg:rounded-none lg:border-none">
                    <h1 className="text-xl font-bold">Calendar</h1>
                    {/* Calendar component goes here */}
                </div>
            </div>
        </div>
    )
}