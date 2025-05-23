
import { AppStatus, ScenarioData } from '@/components/scenario-builder/types';

// Initialize app status
const initialAppStatus: AppStatus = {
  online: navigator.onLine,
  lastSynced: null,
  pendingChanges: false
};

// Track online/offline status
export const setupOfflineSupport = (statusCallback: (status: AppStatus) => void) => {
  let appStatus = { ...initialAppStatus };
  
  // Set up event listeners for online/offline status
  window.addEventListener('online', () => {
    appStatus = { ...appStatus, online: true };
    statusCallback(appStatus);
    syncData();
  });
  
  window.addEventListener('offline', () => {
    appStatus = { ...appStatus, online: false };
    statusCallback(appStatus);
  });
  
  // Return the current status
  return appStatus;
};

// Save scenario to local storage for offline use
export const saveScenarioOffline = (scenario: ScenarioData): void => {
  try {
    // Get existing scenarios
    const savedScenarios = getSavedScenarios();
    
    // Check if scenario already exists
    const existingIndex = savedScenarios.findIndex(s => s.id === scenario.id);
    
    if (existingIndex >= 0) {
      // Update existing scenario
      savedScenarios[existingIndex] = scenario;
    } else {
      // Add new scenario
      savedScenarios.push(scenario);
    }
    
    // Save updated list
    localStorage.setItem('savedScenarios', JSON.stringify(savedScenarios));
    localStorage.setItem('pendingChanges', 'true');
    
    console.log('Scenario saved offline:', scenario.name);
  } catch (error) {
    console.error('Error saving scenario offline:', error);
  }
};

// Get all saved scenarios
export const getSavedScenarios = (): ScenarioData[] => {
  try {
    const saved = localStorage.getItem('savedScenarios');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error retrieving saved scenarios:', error);
    return [];
  }
};

// Sync data when coming back online
const syncData = async (): Promise<void> => {
  const hasPendingChanges = localStorage.getItem('pendingChanges') === 'true';
  
  if (hasPendingChanges) {
    console.log('Syncing offline changes...');
    
    try {
      // In a real app, this would push changes to the server
      // For demo purposes, we'll just clear the flag
      localStorage.setItem('pendingChanges', 'false');
      localStorage.setItem('lastSynced', new Date().toISOString());
      
      console.log('Sync completed successfully');
    } catch (error) {
      console.error('Error syncing data:', error);
    }
  }
};
