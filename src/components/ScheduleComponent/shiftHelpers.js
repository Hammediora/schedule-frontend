// components/ScheduleComponent/shiftHelpers.js

// Helper function to format shift time and indicate AM/PM
export const formatShiftTime = (startTime, endTime) => {
    const formatTime = (time) => {
      const [hour, minute] = time.split(':');
      const hourNum = parseInt(hour, 10);
      const suffix = hourNum >= 12 ? 'PM' : 'AM';
      const formattedHour = hourNum > 12 ? hourNum - 12 : hourNum === 0 ? 12 : hourNum;
      return `${formattedHour}:${minute} ${suffix}`;
    };
  
    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
  };
  
  // Helper function to calculate the difference in hours between two times
  export const calculateShiftDuration = (startTime, endTime) => {
    const start = new Date(`1970-01-01T${startTime}:00Z`);
    const end = new Date(`1970-01-01T${endTime}:00Z`);
    const diffInHours = (end - start) / (1000 * 60 * 60);
    return diffInHours > 0 ? diffInHours : 0;
  };
  