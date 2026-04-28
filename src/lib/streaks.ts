export function calculateStreaks(
    completions: string[],
    today?: string
): number {
    const todayDate = today ?? new Date().toISOString().split("T")[0];

    //removing duplicates
    const unique = [...new Set(completions)];

    //sort data oldest to newest
    const sorted = unique.sort();

    //if today is not in completions, streak reset to zero
    if (!sorted.includes(todayDate)) return 0

    // count consecutive days backwards from today
    let streak = 0;
    let current = new Date(todayDate);

    while (true) {
        const dateStr = current.toISOString().split("T")[0];

        if (sorted.includes(dateStr)) {
            streak++;
            //go back one day
            current.setDate(current.getDate() - 1);
        } else {
            break;
        }
    }

    return streak;
}