function elapsedTime(date: number): string {
    const start = new Date(date);
    const end = new Date();

    const diff = (end.getTime() - start.getTime()) / 1000;

    const times = [
        { name: 'years', milliSeconds: 60 * 60 * 24 * 365 },
        { name: 'months', milliSeconds: 60 * 60 * 24 * 30 },
        { name: 'days', milliSeconds: 60 * 60 * 24 },
        { name: 'hrs', milliSeconds: 60 * 60 },
        { name: 'mins', milliSeconds: 60 },
    ];
    for (const value of times) {
        const betweenTime = Math.floor(diff / value.milliSeconds);
        if (betweenTime >0) {
            return `${betweenTime}${value.name} ago`;
        }
    }
    return "now";
}

export { elapsedTime };