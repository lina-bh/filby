declare global {
  interface Activity {
    name: string;
    room: string[];
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    day: number;
  }
}
