export function exportToGPX(run: any): string {
	const points = run.path || [];
	const gpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Pulse App">
  <trk>
    <name>${run.id || 'Run'}</name>
    <trkseg>
      ${points.map((p: any) => `<trkpt lat="${p.latitude}" lon="${p.longitude}"><time>${new Date(p.timestamp).toISOString()}</time></trkpt>`).join('\n      ')}
    </trkseg>
  </trk>
</gpx>`;
	return gpx;
}

export function exportToTCX(run: any): string {
	const points = run.path || [];
	const tcx = `<?xml version="1.0" encoding="UTF-8"?>
<TrainingCenterDatabase xmlns="http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2">
  <Activities>
    <Activity Sport="Running">
      <Id>${new Date(run.startedAt).toISOString()}</Id>
      <Lap StartTime="${new Date(run.startedAt).toISOString()}" TotalTimeSeconds="${run.durationSec}" DistanceMeters="${run.distanceKm * 1000}">
        <Track>
          ${points.map((p: any) => `<Trackpoint><Time>${new Date(p.timestamp).toISOString()}</Time><Position><LatitudeDegrees>${p.latitude}</LatitudeDegrees><LongitudeDegrees>${p.longitude}</LongitudeDegrees></Position></Trackpoint>`).join('\n          ')}
        </Track>
      </Lap>
    </Activity>
  </Activities>
</TrainingCenterDatabase>`;
	return tcx;
}

export function exportToCSV(run: any): string {
	const points = run.path || [];
	const csv = `timestamp,latitude,longitude,pace,heart_rate
${points.map((p: any) => `${new Date(p.timestamp).toISOString()},${p.latitude},${p.longitude},${run.avgPace || ''},${p.heartRate || ''}`).join('\n')}`;
	return csv;
}