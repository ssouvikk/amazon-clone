import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class TrimPipe implements PipeTransform {
  transform(value: unknown, _metadata: ArgumentMetadata): unknown {
    if (typeof value !== 'object' || value === null) {
      if (typeof value === 'string') {
        return value.trim();
      }
      return value;
    }

    this.trimObject(value as Record<string, unknown>);
    return value;
  }

  private trimObject(obj: Record<string, unknown>): void {
    for (const key of Object.keys(obj)) {
      const value = obj[key];
      if (typeof value === 'string') {
        obj[key] = value.trim();
      } else if (typeof value === 'object' && value !== null) {
        this.trimObject(value as Record<string, unknown>);
      }
    }
  }
}
