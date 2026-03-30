interface SyncTask {
  id: string;
  url: string;
  method: string;
  data: any;
  timestamp: string;
}

export class SyncEngine {
  private dbName = 'StockShieldOfflineDB';
  private storeName = 'sync_queue';
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    if (this.db) return;
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      
      request.onerror = () => reject(request.error);
      
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (e: any) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'id' });
        }
      };
    });
  }

  async addTask(url: string, method: string, data: any): Promise<void> {
    await this.init();
    const task: SyncTask = {
      id: Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9),
      url,
      method,
      data,
      timestamp: new Date().toISOString()
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.add(task);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getTasks(): Promise<SyncTask[]> {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async removeTask(id: string): Promise<void> {
    await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async processQueue(apiInstance: any): Promise<void> {
    if (!navigator.onLine) return;
    const tasks = await this.getTasks();
    if (tasks.length === 0) return;
    
    console.log(`Syncing ${tasks.length} offline actions to server...`);
    for (const task of tasks) {
      try {
        if (task.method === 'post') await apiInstance.post(task.url, task.data);
        if (task.method === 'put') await apiInstance.put(task.url, task.data);
        if (task.method === 'delete') await apiInstance.delete(task.url);
        
        await this.removeTask(task.id);
      } catch (err) {
        console.error("Failed to sync offline task", task, err);
      }
    }
    console.log("Offline sync complete!");
  }
}

export const syncEngine = new SyncEngine();
