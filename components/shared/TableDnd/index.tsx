import { MenuOutlined, CloseOutlined } from '@ant-design/icons';
import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Table as AntTable, Button, Spin } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import { TableStyleDnd } from "./style";
import orderInterface from '../../../shared/interfaces/Dashboard.interface';
interface tableDataProps {
  columns: Array<any>; //verificar luego el tipado
  rowData: Array<orderInterface>;
  loading: boolean;
  activeDrag: boolean;
  fetchMoreData?: () => void;
  activeFilter?: any;
}

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  'data-row-key': string;
}



const TableDnd = ({ columns, rowData, loading, activeDrag, fetchMoreData, activeFilter  }: tableDataProps) => {
  const [dataSource, setDataSource] = useState<Array<orderInterface>>(rowData);
  const containerRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  const Row = ({ children, ...props }: RowProps) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      setActivatorNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id: props['data-row-key'],
    });

    const style: React.CSSProperties = {
      ...props.style,
      transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
      transition,
      ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
      borderLeft: '3px',
      borderColor: 'red'
    };

    return (
      <tr {...props} ref={setNodeRef} style={style} {...attributes}>
        {React.Children.map(children, (child) => {
          if ((child as React.ReactElement).key === 'sort') {
            return React.cloneElement(child as React.ReactElement, {
              children: (
                activeDrag ? <MenuOutlined
                  ref={setActivatorNodeRef}
                  style={{ touchAction: 'none', cursor: 'move' }}
                  {...listeners}
                /> : ''
              ),
            });
          }
          return child;
        })}
      </tr>
    );
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id && activeDrag) {
      setDataSource((previous) => {
        const activeIndex = previous.findIndex((i) => i.key === active.id);
        const overIndex = previous.findIndex((i) => i.key === over?.id);
        return arrayMove(previous, activeIndex, overIndex);
      });
    }
  };

  useEffect(() => {
    setDataSource(rowData);
  }, [rowData]);

  useEffect(() => {

    if (!activeDrag) {
      const intervalId = setInterval(() => {
        if (containerRef.current) {
          containerRef.current.scrollBy(0, 50); // scroll down by 50 pixels
        }
      }, 5000); // scroll every 5 seconds

      // hacer que el scroll vuelva iniciar desde el inicio cuando se llega al final
      if (containerRef.current) {
        containerRef.current.addEventListener('scroll', () => {
          if (
            containerRef.current &&
            containerRef.current.scrollTop + containerRef.current.clientHeight ===
            containerRef.current.scrollHeight
          ) {
            containerRef.current.scrollTo(0, 0);
          }
        });
      }

      return () => clearInterval(intervalId); // clean up the interval on unmount
    }
  }, []);



  // useEffect(() => {
  //   if (dataSource.length > 0) {
  //     if (containerRef.current) {
  //       observer.current = new IntersectionObserver(handleIntersection,
  //         { root: null, rootMargin: '0px', threshold: 0.5 }
  //       );
  //     }

  //     const tableRows = containerRef.current?.querySelectorAll('.ant-table-row');

  //     tableRows?.forEach((row) => {
  //       observer.current?.observe(row);
  //     });

  //     return () => {
  //       if (observer.current) {
  //         observer.current?.disconnect();
  //       }
  //     };
  //   }
  // }, [dataSource]);


  // const handleIntersection = (entries: IntersectionObserverEntry[]) => {
  //   entries.forEach((entry: IntersectionObserverEntry) => {
  //     if (entry.isIntersecting) {
  //       // Check if the observed row is the last visible row
  //       if (entry.target === containerRef.current?.querySelector('.ant-table-row:last-child')) {
  //         // Perform an action when the last row becomes visible
  //         console.log('Last row is visible!');
  //         fetchMoreData && fetchMoreData();
  //       }
  //     }
  //   });
  // };

  return (

    <DndContext onDragEnd={onDragEnd}>
      <SortableContext
        // rowKey array
        items={dataSource.map((i) => i.key)}
        strategy={verticalListSortingStrategy}
      >
        <TableStyleDnd>
          <div className='customDiv'
            ref={containerRef}
            style={{ height: 'calc(100vh - 15vh)', overflowY: "scroll", textAlign: 'center'}}
          >
            <AntTable
              components={{
                body: {
                  row: Row,
                },
              }}
              showHeader={activeDrag ? true : false}
              rowKey="key"
              columns={columns}
              dataSource={dataSource}
              className="custom-table-classname"
              pagination={false}
              loading={loading}
              ref={containerRef}
            // scroll={{y:1500, x:1550}}
            />

            { activeFilter?.taller === "" && activeFilter?.servicio === "" && activeFilter?.zona === "" ? <Button 
              className='button-more'
              onClick={() => {
                fetchMoreData && fetchMoreData();
              }}

            >
              <span>Cargar más</span> 
            </Button> : <></> 
            }
          </div>

        </TableStyleDnd>
      </SortableContext>
    </DndContext>
  );
};

export default TableDnd;