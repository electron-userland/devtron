import { useMemo, useState, useEffect, useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type {
  ColDef,
  ICellRendererParams,
  RowClickedEvent,
  ValueFormatterParams,
} from 'ag-grid-community';
import {
  ModuleRegistry,
  CellStyleModule,
  ClientSideRowModelModule,
  RowSelectionModule,
  themeQuartz,
} from 'ag-grid-community';
import { Ban } from 'lucide-react';
import { MSG_TYPE, PORT_NAME } from '../../../common/constants';
import ResizablePanel from './ResizablePanel';
import type { IpcEventDataIndexed, MessagePanel } from '../../../types/shared';
import DirectionBadge from './DirectionBadge';
import formatTimestamp from '../utils/formatTimestamp';
import DetailPanel from './DetailPanel';

ModuleRegistry.registerModules([ClientSideRowModelModule, RowSelectionModule, CellStyleModule]);

function Panel() {
  const MAX_EVENTS_TO_DISPLAY = 1000;
  const [events, setEvents] = useState<IpcEventDataIndexed[]>([]);
  const portRef = useRef<chrome.runtime.Port | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const clearEventsRef = useRef(() => {});

  /**
   * Comment out the useEffect below if you want to test the UI in dev mode on localhost
   * and use JSON data from test_data/test_data.js for testing.
   */
  useEffect(() => {
    const port = chrome.runtime.connect({ name: PORT_NAME.PANEL });
    portRef.current = port;

    const pingInterval = setInterval(() => {
      port.postMessage({ type: MSG_TYPE.KEEP_ALIVE });
    }, 10 * 1000);

    pingIntervalRef.current = pingInterval;

    port.onDisconnect.addListener(() => {
      if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
      console.log('Devtron - Panel disconnected');
    });

    const onMessage = (message: MessagePanel): void => {
      if (message.type === MSG_TYPE.RENDER_EVENT) {
        setEvents((prev) => [...prev, message.event].slice(-MAX_EVENTS_TO_DISPLAY));
      }
      if (message.type === MSG_TYPE.PONG) {
        // Do nothing // #EDIT or #REMOVE
      }
    };

    port.onMessage.addListener(onMessage);

    clearEventsRef.current = () => {
      try {
        port.postMessage({
          type: MSG_TYPE.CLEAR_EVENTS,
        } satisfies MessagePanel);
        setEvents([]);
      } catch (error) {
        console.error('Devtron - Error clearing events:', error);
      }
    };

    port.postMessage({ type: MSG_TYPE.GET_ALL_EVENTS } satisfies MessagePanel);

    return () => {
      if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
      port.onMessage.removeListener(onMessage);
      portRef.current = null;
      clearEventsRef.current = () => {};
      if (port) {
        port.disconnect();
      }
    };
  }, []);

  const [selectedRow, setSelectedRow] = useState<IpcEventDataIndexed | null>(null);
  const [showDetailPanel, setShowDetailPanel] = useState<boolean>(false);

  const columnDefs: ColDef<IpcEventDataIndexed>[] = useMemo(
    () => [
      {
        headerName: 'No.',
        field: 'serialNumber',
        width: 55,
        cellClass: 'flex !p-1 items-center h-full text-xs',
      },
      {
        headerName: 'Time',
        field: 'timestamp',
        width: 120,
        valueFormatter: (params: ValueFormatterParams<IpcEventDataIndexed, any>) => {
          return formatTimestamp(params.value);
        },
        cellClass: 'flex !p-1 items-center h-full text-xs',
      },
      {
        headerName: 'Direction',
        field: 'direction',
        width: 85,
        cellRenderer: (params: ICellRendererParams<IpcEventDataIndexed>) => {
          return <DirectionBadge direction={params.value} />;
        },
        cellClass: 'flex !p-1 items-center h-full',
      },
      {
        headerName: 'Channel',
        field: 'channel',
        flex: 1,
        cellClass: 'font-roboto text-[13px] !p-1 h-full flex items-center',
      },
      {
        headerName: 'Data',
        field: 'args',
        flex: 3,
        cellRenderer: (params: ICellRendererParams<IpcEventDataIndexed>) => {
          const jsonStr = JSON.stringify(params.value);
          const preview = jsonStr.length > 120 ? jsonStr.slice(0, 120) + '...' : jsonStr;
          return (
            <span className="text-xs font-space-mono text-gray-600 truncate block">{preview}</span>
          );
        },
        cellClass: 'flex !p-1 items-center h-full',
      },
    ],
    []
  );

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
    }),
    []
  );

  const onRowClicked = (event: RowClickedEvent<IpcEventDataIndexed>) => {
    setSelectedRow(event.data ?? null);
    setShowDetailPanel(true);
  };

  const handleCloseDetailPanel = () => {
    setShowDetailPanel(false);
    setSelectedRow(null);
  };

  return (
    <div className="h-screen w-full flex border border-gray-300 rounded overflow-hidden bg-white">
      <div className={`flex-1 flex flex-col ${showDetailPanel ? 'min-w-96' : ''}`}>
        {/* Header */}
        <div className="px-3 py-2 bg-gray-100 border-b border-gray-300 justify-between text-sm font-medium flex items-center gap-2">
          <div className="">Devtron</div>
          <div>
            <button
              className="text-[#78797a] p-1 rounded-full hover:bg-gray-300"
              onClick={() => clearEventsRef.current()}
            >
              <Ban strokeWidth={3} size={15} />
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1">
          <AgGridReact
            rowData={events}
            columnDefs={columnDefs}
            theme={themeQuartz.withParams({
              cellFontFamily: 'roboto, sans-serif',
              rowBorder: { style: 'solid', width: '2px', color: '#e5e7eb' },
            })}
            defaultColDef={defaultColDef}
            onRowClicked={onRowClicked}
            rowSelection="single"
            suppressRowClickSelection={false}
            suppressCellFocus={true}
            headerHeight={32}
            rowHeight={29}
          />
        </div>
      </div>

      {/* Details panel */}
      <ResizablePanel isOpen={showDetailPanel}>
        <DetailPanel selectedRow={selectedRow} onClose={handleCloseDetailPanel} />
      </ResizablePanel>
    </div>
  );
}

export default Panel;
