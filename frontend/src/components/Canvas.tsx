import React, { useCallback, useEffect, useRef, useState } from 'react';
import {ChatDraws} from "../types";

interface Props {
  painted: ChatDraws[];
  onDraw(coords: ChatDraws): void;
}

const Canvas: React.FC<Props> = ({ painted, onDraw }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePosition, setMousePosition] = useState<ChatDraws | null>(null);

  const startPaint = useCallback((event: MouseEvent) => {
    const coordinates = getCoordinates(event);
    if (coordinates) {
      setMousePosition(coordinates);
    }
  }, []);

  const paint = useCallback((event: MouseEvent) => {
    if (!canvasRef.current || !mousePosition) {
      return;
    }
    const coordinates = getCoordinates(event);
    if (coordinates) {
      drawLine(mousePosition, coordinates);
      onDraw(coordinates);
      setMousePosition(coordinates);
    }
  }, [mousePosition, onDraw]);

  const getCoordinates = (event: MouseEvent): ChatDraws | null => {
    if (!canvasRef.current) {
      return null;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    return { dotX: event.pageX - canvas.offsetLeft, dotY: event.pageY - canvas.offsetTop };
  };

  const drawLine = (start: ChatDraws, end: ChatDraws) => {
    if (!canvasRef.current) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.strokeStyle = 'black'; // Установка цвета линии
      ctx.lineJoin = 'round';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(start.dotX, start.dotY);
      ctx.lineTo(end.dotX, end.dotY);
      ctx.closePath();
      ctx.stroke();
    }
  };

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    canvas.addEventListener('mousedown', startPaint);
    return () => {
      canvas.removeEventListener('mousedown', startPaint);
    };
  }, [startPaint]);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    canvas.addEventListener('mousemove', paint);
    return () => {
      canvas.removeEventListener('mousemove', paint);
    };
  }, [paint]);

  const handleMouseUp = () => {
    setMousePosition(null);
  };

  useEffect(() => {
    if (!canvasRef.current || !painted) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      painted.forEach(dot => {
        drawLine({ dotX: dot.dotX, dotY: dot.dotY }, { dotX: dot.dotX, dotY: dot.dotY });
      });
    }
  }, [painted]);

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth}
      height={600}
      style={{ borderTop: '2px solid black', borderBottom: '2px solid black' }}
      onMouseUp={handleMouseUp}
    />
  );
};

export default Canvas;
