/**
 * PopoverQueue - sequential execution of popover tasks
 */
export class PopoverQueue {
  private queue: (() => Promise<void>)[] = []
  private isProcessing = false

  async add(task: () => Promise<void>): Promise<void> {
    return new Promise((resolve) => {
      this.queue.push(async () => {
        await task()
        resolve(undefined)
      })
      if (!this.isProcessing) {
        this.processNext()
      }
    })
  }

  private async processNext(): Promise<void> {
    if (this.queue.length === 0) {
      this.isProcessing = false
      return
    }
    this.isProcessing = true
    const task = this.queue.shift()
    if (task) {
      await task()
      await this.processNext()
    }
  }
}
