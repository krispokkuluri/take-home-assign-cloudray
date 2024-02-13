import * as fs from "fs";

interface HeartRateMeasurement {
  beatsPerMinute: number;
  timestamps: {
    startTime: string;
    endTime: string;
  };
}

interface DailyHeartRateStatistics {
  date: string;
  min: number;
  max: number;
  median: number;
  latestDataTimestamp: string;
}

function calculateHeartRateStatistics(heartRateData: HeartRateMeasurement[]): DailyHeartRateStatistics[] {
  const dailyStats: DailyHeartRateStatistics[] = [];

  // Assuming heartRateData is sorted by date and time
  const dates = Array.from(new Set(
    heartRateData
      .filter(data => data && data.timestamps && data.timestamps.startTime) // Filter out undefined or null values
      .map(data => data.timestamps.startTime.split('T')[0])
  ));

  for (const date of dates) {
    const dailyData = heartRateData.filter((data) => data.timestamps.startTime.startsWith(date));

    const beatsPerMinuteArray = dailyData.map((data) => data.beatsPerMinute);
    const min = Math.min(...beatsPerMinuteArray);
    const max = Math.max(...beatsPerMinuteArray);
    const median = calculateMedian(beatsPerMinuteArray);
    const latestDataTimestamp = dailyData[dailyData.length - 1].timestamps.endTime;

    dailyStats.push({
      date,
      min,
      max,
      median,
      latestDataTimestamp,
    });
  }

  return dailyStats;
}

function calculateMedian(array: number[]): number {
  const sortedArray = array.slice().sort((a, b) => a - b);
  const middle = Math.floor(sortedArray.length / 2);

  if (sortedArray.length % 2 === 0) {
    return (sortedArray[middle - 1] + sortedArray[middle]) / 2;
  } else {
    return sortedArray[middle];
  }
}

// Read the heart rate data from the input file
const inputFilename = 'heartrate.json';
const inputData = JSON.parse(fs.readFileSync(inputFilename, 'utf8')) as HeartRateMeasurement[];

// Calculate heart rate statistics
const heartRateStats = calculateHeartRateStatistics(inputData);

// Write the output to the output file
const outputFilename = 'output.json';
fs.writeFileSync(outputFilename, JSON.stringify(heartRateStats, null, 2));

console.log(`Heart rate statistics calculated and saved to ${outputFilename}`);
