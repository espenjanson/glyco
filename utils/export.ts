import * as FileSystem from 'expo-file-system';
import { StorageService } from './storage';

export const ExportService = {
  async exportToCSV(): Promise<string> {
    const [readings, shots, carbs] = await Promise.all([
      StorageService.getGlucoseReadings(),
      StorageService.getInsulinShots(),
      StorageService.getCarbEntries(),
    ]);

    let csvContent = '';

    csvContent += 'Type,Date,Time,Value,Unit,Notes\n';

    readings.forEach(reading => {
      const date = reading.timestamp.toLocaleDateString();
      const time = reading.timestamp.toLocaleTimeString();
      csvContent += `Glucose,${date},${time},${reading.value},${reading.unit},"${reading.notes || ''}"\n`;
    });

    shots.forEach(shot => {
      const date = shot.timestamp.toLocaleDateString();
      const time = shot.timestamp.toLocaleTimeString();
      csvContent += `Insulin,${date},${time},${shot.units},units,"${shot.type} - ${shot.notes || ''}"\n`;
    });

    carbs.forEach(carb => {
      const date = carb.timestamp.toLocaleDateString();
      const time = carb.timestamp.toLocaleTimeString();
      csvContent += `Carbs,${date},${time},${carb.carbs},grams,"${carb.food} - ${carb.notes || ''}"\n`;
    });

    const fileName = `glyco_export_${new Date().toISOString().split('T')[0]}.csv`;
    const fileUri = FileSystem.documentDirectory + fileName;

    await FileSystem.writeAsStringAsync(fileUri, csvContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    return fileUri;
  },
};