

export const calculateEndTime = (startTime, durationInHours) => {
    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + durationInHours);
    return endTime;
};



