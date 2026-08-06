import { FormControl, FormGroup } from '@angular/forms';
import type { Block } from '../blocks/types';

export function createBlockFormGroup(block: Block): FormGroup {
  const base = { id: new FormControl({ value: block.id, disabled: true }) };

  switch (block.type) {
    case 'heading':
      return new FormGroup({
        ...base,
        type: new FormControl('heading' as const, { nonNullable: true }),
        level: new FormControl(block.level, { nonNullable: true }),
        text: new FormControl(block.text, { nonNullable: true }),
      });
    case 'paragraph':
      return new FormGroup({
        ...base,
        type: new FormControl('paragraph' as const, { nonNullable: true }),
        text: new FormControl(block.text, { nonNullable: true }),
      });
    case 'code':
      return new FormGroup({
        ...base,
        type: new FormControl('code' as const, { nonNullable: true }),
        language: new FormControl(block.language, { nonNullable: true }),
        text: new FormControl(block.text, { nonNullable: true }),
      });
    case 'image':
      return new FormGroup({
        ...base,
        type: new FormControl('image' as const, { nonNullable: true }),
        src: new FormControl(block.src, { nonNullable: true }),
        alt: new FormControl(block.alt, { nonNullable: true }),
        caption: new FormControl(block.caption ?? null),
      });
  }
}
