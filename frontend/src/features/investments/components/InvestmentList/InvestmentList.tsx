// /src/features/investments/components/InvestmentList/InvestmentList.tsx
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';
 
interface InvestmentListProps {
  investments: Investment[];
  onViewDetail: (id: string) => void;
}
 
export function InvestmentList({ investments, onViewDetail }: InvestmentListProps) {
  const parentRef = useRef<HTMLDivElement>(null);
 
  const virtualizer = useVirtualizer({
    count: investments.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 180, // altura estimada en px de cada InvestmentCard
    overscan: 5,             // renderizar 5 items extra fuera del viewport
  });
 
  return (
    <div ref={parentRef} className="h-[600px] overflow-auto">
      <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <InvestmentCard
              investment={investments[virtualItem.index]}
              onViewDetail={onViewDetail}
            />
          </div>
        ))}
      </div>
    </div>
  );
}