/**
 * Autonomous Worker Coordination System
 * Supercharged workers with Brain AI coordination, parallel execution,
 * smart scheduling, and self-healing capabilities
 */

import { EventEmitter } from "events";
import { SmartBrainEngine } from "../brain/SmartBrainEngine";

export interface WorkerTask {
  id: string;
  type: string;
  priority: number;
  data: any;
  status: "pending" | "running" | "completed" | "failed";
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  result?: any;
  error?: string;
}

export interface Worker {
  id: string;
  name: string;
  status: "idle" | "busy" | "error";
  currentTask?: string;
  tasksCompleted: number;
  tasksFailed: number;
  averageExecutionTime: number;
}

export class AutonomousWorkerSystem extends EventEmitter {
  private brain: SmartBrainEngine;
  private workers: Map<string, Worker>;
  private taskQueue: WorkerTask[];
  private activeTasks: Map<string, WorkerTask>;
  private maxParallelWorkers: number;
  private schedulingEnabled: boolean;

  constructor(brain: SmartBrainEngine, maxParallelWorkers: number = 5) {
    super();
    this.brain = brain;
    this.workers = new Map();
    this.taskQueue = [];
    this.activeTasks = new Map();
    this.maxParallelWorkers = maxParallelWorkers;
    this.schedulingEnabled = true;

    // Initialize workers
    this.initializeWorkers();
  }

  /**
   * Initialize worker pool
   */
  private initializeWorkers(): void {
    for (let i = 0; i < this.maxParallelWorkers; i++) {
      const worker: Worker = {
        id: `worker_${i + 1}`,
        name: `Worker ${i + 1}`,
        status: "idle",
        tasksCompleted: 0,
        tasksFailed: 0,
        averageExecutionTime: 0,
      };
      this.workers.set(worker.id, worker);
    }
  }

  /**
   * Submit task to queue with Brain-powered prioritization
   */
  async submitTask(
    type: string,
    data: any,
    priority?: number
  ): Promise<string> {
    // Use Brain to determine optimal priority if not specified
    if (priority === undefined) {
      const decision = await this.brain.makeDecision(
        "task_prioritization",
        [{ type, data }]
      );
      priority = decision.confidence * 10; // Convert confidence to priority
    }

    const task: WorkerTask = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      priority,
      data,
      status: "pending",
      createdAt: new Date(),
    };

    // Add to queue (sorted by priority)
    this.taskQueue.push(task);
    this.taskQueue.sort((a, b) => b.priority - a.priority);

    this.emit("taskSubmitted", task);

    // Trigger scheduling
    this.scheduleNextTasks();

    return task.id;
  }

  /**
   * Smart scheduling with Brain AI
   */
  private async scheduleNextTasks(): Promise<void> {
    if (!this.schedulingEnabled) return;

    // Find idle workers
    const idleWorkers = Array.from(this.workers.values()).filter(
      (w) => w.status === "idle"
    );

    if (idleWorkers.length === 0 || this.taskQueue.length === 0) return;

    // Use Brain to optimize task-worker matching
    const matches = await this.optimizeTaskWorkerMatching(
      idleWorkers,
      this.taskQueue.slice(0, idleWorkers.length)
    );

    // Assign tasks to workers
    for (const { worker, task } of matches) {
      await this.assignTaskToWorker(worker.id, task);
    }
  }

  /**
   * Brain-powered task-worker matching optimization
   */
  private async optimizeTaskWorkerMatching(
    workers: Worker[],
    tasks: WorkerTask[]
  ): Promise<Array<{ worker: Worker; task: WorkerTask }>> {
    // Simple matching for now - can be enhanced with ML
    const matches: Array<{ worker: Worker; task: WorkerTask }> = [];

    for (let i = 0; i < Math.min(workers.length, tasks.length); i++) {
      matches.push({
        worker: workers[i],
        task: tasks[i],
      });
    }

    return matches;
  }

  /**
   * Assign task to specific worker
   */
  private async assignTaskToWorker(
    workerId: string,
    task: WorkerTask
  ): Promise<void> {
    const worker = this.workers.get(workerId);
    if (!worker || worker.status !== "idle") return;

    // Remove from queue
    this.taskQueue = this.taskQueue.filter((t) => t.id !== task.id);

    // Update worker and task status
    worker.status = "busy";
    worker.currentTask = task.id;
    task.status = "running";
    task.startedAt = new Date();

    this.activeTasks.set(task.id, task);

    this.emit("taskStarted", { worker, task });

    // Execute task
    this.executeTask(worker, task);
  }

  /**
   * Execute task with error handling and self-healing
   */
  private async executeTask(
    worker: Worker,
    task: WorkerTask
  ): Promise<void> {
    const startTime = Date.now();

    try {
      // Execute task based on type
      const result = await this.performTaskExecution(task);

      // Update task
      task.status = "completed";
      task.completedAt = new Date();
      task.result = result;

      // Update worker stats
      worker.tasksCompleted++;
      const executionTime = Date.now() - startTime;
      worker.averageExecutionTime =
        (worker.averageExecutionTime * (worker.tasksCompleted - 1) +
          executionTime) /
        worker.tasksCompleted;

      this.emit("taskCompleted", { worker, task, executionTime });
    } catch (error) {
      // Handle error with self-healing
      await this.handleTaskError(worker, task, error);
    } finally {
      // Clean up
      worker.status = "idle";
      worker.currentTask = undefined;
      this.activeTasks.delete(task.id);

      // Schedule next task
      this.scheduleNextTasks();
    }
  }

  /**
   * Perform actual task execution
   */
  private async performTaskExecution(task: WorkerTask): Promise<any> {
    // Task execution logic based on type
    switch (task.type) {
      case "frame_processing":
        return this.processFrame(task.data);
      case "quest_validation":
        return this.validateQuest(task.data);
      case "mint_distribution":
        return this.distributeMint(task.data);
      case "data_sync":
        return this.syncData(task.data);
      default:
        return { success: true, message: "Task executed" };
    }
  }

  private async processFrame(data: any): Promise<any> {
    // Frame processing logic
    return { processed: true, frameId: data.id };
  }

  private async validateQuest(data: any): Promise<any> {
    // Quest validation logic
    return { valid: true, questId: data.id };
  }

  private async distributeMint(data: any): Promise<any> {
    // Mint distribution logic
    return { distributed: true, mintId: data.id };
  }

  private async syncData(data: any): Promise<any> {
    // Data sync logic
    return { synced: true, records: data.count };
  }

  /**
   * Handle task error with self-healing
   */
  private async handleTaskError(
    worker: Worker,
    task: WorkerTask,
    error: any
  ): Promise<void> {
    task.status = "failed";
    task.error = error instanceof Error ? error.message : String(error);
    worker.tasksFailed++;

    this.emit("taskFailed", { worker, task, error });

    // Ask Brain for recovery strategy
    const decision = await this.brain.makeDecision("error_recovery", [
      { action: "retry", task },
      { action: "skip", task },
      { action: "escalate", task },
    ]);

    if (decision.chosen.action === "retry") {
      // Retry with lower priority
      task.status = "pending";
      task.priority = Math.max(0, task.priority - 1);
      this.taskQueue.push(task);
    }
  }

  /**
   * Get system status
   */
  getStatus() {
    return {
      workers: Array.from(this.workers.values()),
      queueLength: this.taskQueue.length,
      activeTasks: Array.from(this.activeTasks.values()),
      totalCompleted: Array.from(this.workers.values()).reduce(
        (sum, w) => sum + w.tasksCompleted,
        0
      ),
      totalFailed: Array.from(this.workers.values()).reduce(
        (sum, w) => sum + w.tasksFailed,
        0
      ),
    };
  }

  /**
   * Pause scheduling
   */
  pause(): void {
    this.schedulingEnabled = false;
    this.emit("systemPaused");
  }

  /**
   * Resume scheduling
   */
  resume(): void {
    this.schedulingEnabled = true;
    this.emit("systemResumed");
    this.scheduleNextTasks();
  }
}
