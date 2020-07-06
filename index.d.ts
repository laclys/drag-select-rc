import { FC } from 'react';

interface DragSelectProps {
  value: boolean[][];
  onChange: (val: boolean[][]) => void;
}

declare const DragSelectRc: FC<DragSelectProps>;
export default DragSelectRc;
