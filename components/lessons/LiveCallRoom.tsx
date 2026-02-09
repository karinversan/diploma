"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Copy,
  Eraser,
  Eye,
  EyeOff,
  GripVertical,
  Hand,
  Loader2,
  MessageCircle,
  Mic,
  MicOff,
  MoreVertical,
  Move,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Paperclip,
  Pencil,
  PhoneOff,
  RefreshCcw,
  SendHorizontal,
  ShieldCheck,
  Sparkles,
  StickyNote,
  Video,
  VideoOff,
  Rows3,
  ZoomIn,
  ZoomOut
} from "lucide-react";
import { ComponentType, FormEvent, PointerEvent as ReactPointerEvent, WheelEvent, useEffect, useMemo, useRef, useState } from "react";

import { HomeworkItem } from "@/data/homework";
import { StudentLesson } from "@/data/lessons";
import { studentProfile } from "@/data/student";
import { VocabularyWord } from "@/data/vocabulary";
import { cn } from "@/lib/utils";

type LiveCallRoomProps = {
  lesson: StudentLesson;
  backHref: string;
  teacherAvatarUrl?: string;
  vocabulary?: VocabularyWord[];
  homework?: HomeworkItem[];
};

type ChatMessage = {
  id: string;
  author: string;
  text: string;
  time: string;
  mine?: boolean;
  avatarUrl?: string;
};

type ConnectionState = "authorizing" | "connecting" | "connected" | "reconnecting" | "failed";
type WorkspaceTab = "board" | "quiz";
type SideTab = "chat" | "artifacts";
type ArtifactTab = "transcript" | "summary" | "recommendations" | "vocabulary" | "homework";

type TestQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
};

type BoardTool = "pan" | "pen" | "sticky";

type BoardPoint = {
  x: number;
  y: number;
};

type BoardPath = {
  id: string;
  color: string;
  size: number;
  points: BoardPoint[];
};

type BoardNote = {
  id: string;
  x: number;
  y: number;
  color: string;
  text: string;
};

type BoardInteraction =
  | {
      mode: "pan";
      pointerId: number;
      startClientX: number;
      startClientY: number;
      startOffsetX: number;
      startOffsetY: number;
    }
  | {
      mode: "draw";
      pointerId: number;
      pathId: string;
    }
  | {
      mode: "drag-note";
      pointerId: number;
      noteId: string;
      noteOffsetX: number;
      noteOffsetY: number;
    }
  | null;

const groupTestQuestions: TestQuestion[] = [
  {
    id: "q-1",
    prompt: "Выберите корректную форму: She ___ already finished the task.",
    options: ["have", "has", "had", "is"],
    correctOptionIndex: 1,
    explanation: "В Present Perfect с she используется has."
  },
  {
    id: "q-2",
    prompt: "Какой вариант лучше для делового письма?",
    options: [
      "Send me answer now.",
      "Could you share your feedback by Friday?",
      "I wait your response.",
      "You must answer quickly."
    ],
    correctOptionIndex: 1,
    explanation: "Это вежливая и профессиональная формулировка."
  },
  {
    id: "q-3",
    prompt: "Какой глагол подходит по смыслу: We need to ___ the results after the lesson.",
    options: ["analyse", "avoid", "delay", "hide"],
    correctOptionIndex: 0,
    explanation: "После урока мы обычно анализируем результаты."
  }
];

const boardPenColors = ["#2f6cf6", "#111827", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"];
const boardNoteColors = ["#fff3a9", "#b7f4db", "#cfe2ff", "#fdd6b4", "#f9d3ff"];
const defaultBoardOffset = { x: 120, y: 80 };

function formatTime(date = new Date()) {
  return new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function formatDateLabel(dateValue: string) {
  const label = new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "long",
    weekday: "short"
  }).format(new Date(dateValue));

  return label.replace(/^[A-Za-zА-Яа-яЁё]/, (first) => first.toLowerCase());
}

function formatLessonTime(dateValue: string) {
  return new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(dateValue));
}

function formatHomeworkDate(value: string) {
  return new Intl.DateTimeFormat("ru-RU", { day: "2-digit", month: "short" }).format(new Date(value));
}

function getConnectionLabel(state: ConnectionState) {
  if (state === "authorizing") {
    return "Ожидание авторизации";
  }
  if (state === "connecting") {
    return "Подключение к комнате";
  }
  if (state === "reconnecting") {
    return "Переподключение";
  }
  if (state === "failed") {
    return "Соединение потеряно";
  }
  return "Соединение стабильно";
}

function getConnectionClasses(state: ConnectionState) {
  if (state === "connected") {
    return "border-emerald-300 bg-emerald-50 text-emerald-700";
  }
  if (state === "failed") {
    return "border-rose-300 bg-rose-50 text-rose-700";
  }
  return "border-amber-300 bg-amber-50 text-amber-700";
}

function addMinutes(dateValue: string, minutes: number) {
  const base = new Date(dateValue).getTime();
  const next = new Date(base + minutes * 60 * 1000);
  return new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(next);
}

function getTranscriptSegments(lesson: StudentLesson) {
  const parts = lesson.transcriptSnippet
    .split(/[.!?]+/)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 4);

  return parts.map((text, index) => ({
    id: `${lesson.id}-segment-${index}`,
    time: addMinutes(lesson.startAt, index * 4),
    speaker: index % 2 === 0 ? lesson.teacherName : "Вы",
    text: `${text}.`
  }));
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function buildPath(points: BoardPoint[]) {
  if (points.length === 0) {
    return "";
  }

  return points.reduce((result, point, index) => {
    if (index === 0) {
      return `M ${point.x} ${point.y}`;
    }
    return `${result} L ${point.x} ${point.y}`;
  }, "");
}

type ControlButtonProps = {
  active?: boolean;
  danger?: boolean;
  disabled?: boolean;
  label: string;
  onClick?: () => void;
  icon: ComponentType<{ className?: string }>;
};

function ControlButton({ active, danger, disabled, label, onClick, icon: Icon }: ControlButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex h-11 w-11 items-center justify-center rounded-full border text-foreground transition disabled:cursor-not-allowed disabled:opacity-50",
        danger
          ? "border-rose-400 bg-rose-500 text-white hover:bg-rose-600"
          : active
            ? "border-primary/40 bg-primary text-primary-foreground"
            : "border-border bg-white hover:border-primary/35"
      )}
      aria-label={label}
      title={label}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}

export function LiveCallRoom({ lesson, backHref, teacherAvatarUrl, vocabulary = [], homework = [] }: LiveCallRoomProps) {
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isCameraEnabled, setIsCameraEnabled] = useState(true);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceTab>("board");
  const [activeSideTab, setActiveSideTab] = useState<SideTab>("chat");
  const [activeArtifactTab, setActiveArtifactTab] = useState<ArtifactTab>("transcript");
  const [isSupportPanelOpen, setIsSupportPanelOpen] = useState(true);
  const [isWorkspaceVisible, setIsWorkspaceVisible] = useState(true);
  const [isVideoVisible, setIsVideoVisible] = useState(true);
  const [areParticipantTilesVisible, setAreParticipantTilesVisible] = useState(false);

  const [draftMessage, setDraftMessage] = useState("");
  const [copiedRoomId, setCopiedRoomId] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      author: lesson.teacherName,
      text: "Сегодня разбираем ошибку из прошлого домашнего теста.",
      time: "19:12",
      avatarUrl: teacherAvatarUrl ?? "/avatars/avatar-2.svg"
    },
    {
      id: "msg-2",
      author: "Егор",
      text: "У меня вопрос по второму пункту.",
      time: "19:13",
      avatarUrl: "/avatars/avatar-5.svg"
    },
    {
      id: "msg-3",
      author: "Вы",
      text: "Давайте начнем с мини-теста, потом вопрос.",
      time: "19:13",
      mine: true
    }
  ]);

  const roomId = `room-${lesson.id}-${lesson.teacherId}`;
  const roomAccessKey = `live-room-access:${roomId}`;

  const [isAuthorized, setIsAuthorized] = useState(false);
  const [connectionState, setConnectionState] = useState<ConnectionState>("authorizing");

  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizChecked, setQuizChecked] = useState<Record<string, boolean>>({});

  const splitContainerRef = useRef<HTMLDivElement | null>(null);
  const [workspaceWidthRatio, setWorkspaceWidthRatio] = useState(58);
  const [isResizingSplit, setIsResizingSplit] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(1920);
  const [splitContainerWidth, setSplitContainerWidth] = useState(0);
  const isDesktopSplit = viewportWidth >= 1024 && isWorkspaceVisible && isVideoVisible;
  const workspaceMinWidthPx = isSupportPanelOpen ? (viewportWidth >= 1700 ? 700 : viewportWidth >= 1440 ? 620 : 560) : viewportWidth >= 1600 ? 620 : 520;
  const videoMinWidthPx = isSupportPanelOpen ? 300 : 340;
  const splitHandleWidthPx = isDesktopSplit ? 8 : 0;
  const availableSplitWidthPx = Math.max(1, splitContainerWidth - splitHandleWidthPx);
  const splitBounds = useMemo(() => {
    if (!isDesktopSplit) {
      return { minRatio: 38, maxRatio: 86 };
    }

    let minRatio = clamp((workspaceMinWidthPx / availableSplitWidthPx) * 100, 32, 94);
    let maxRatio = clamp(((availableSplitWidthPx - videoMinWidthPx) / availableSplitWidthPx) * 100, 36, 96);

    if (minRatio >= maxRatio) {
      const fallback = isSupportPanelOpen ? 66 : 58;
      minRatio = fallback - 1;
      maxRatio = fallback + 1;
    }

    return { minRatio, maxRatio };
  }, [availableSplitWidthPx, isDesktopSplit, isSupportPanelOpen, videoMinWidthPx, workspaceMinWidthPx]);
  const effectiveWorkspaceRatio = clamp(workspaceWidthRatio, splitBounds.minRatio, splitBounds.maxRatio);
  const boardViewportRef = useRef<HTMLDivElement | null>(null);
  const boardInteractionRef = useRef<BoardInteraction>(null);
  const [boardTool, setBoardTool] = useState<BoardTool>("pan");
  const [boardStrokeColor, setBoardStrokeColor] = useState("#2f6cf6");
  const [boardStrokeSize, setBoardStrokeSize] = useState(4);
  const [boardScale, setBoardScale] = useState(1);
  const [boardOffset, setBoardOffset] = useState(defaultBoardOffset);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [boardPaths, setBoardPaths] = useState<BoardPath[]>([]);
  const [boardNotes, setBoardNotes] = useState<BoardNote[]>([
    { id: "note-1", x: 480, y: 230, color: boardNoteColors[0], text: "Новые слова из урока" },
    { id: "note-2", x: 760, y: 420, color: boardNoteColors[2], text: "Проверить правило Present Perfect" }
  ]);

  useEffect(() => {
    const savedAccess = window.sessionStorage.getItem(roomAccessKey);
    const hasSavedAccess = savedAccess === studentProfile.id;

    if (hasSavedAccess) {
      setIsAuthorized(true);
      setConnectionState("connecting");
      return;
    }

    setIsAuthorized(false);
    setConnectionState("authorizing");
  }, [roomAccessKey]);

  useEffect(() => {
    if (!isAuthorized) {
      return;
    }
    if (connectionState !== "connecting" && connectionState !== "reconnecting") {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setConnectionState("connected");
    }, 900);

    return () => window.clearTimeout(timeoutId);
  }, [connectionState, isAuthorized]);

  useEffect(() => {
    if (!copiedRoomId) {
      return;
    }

    const timeoutId = window.setTimeout(() => setCopiedRoomId(false), 1500);
    return () => window.clearTimeout(timeoutId);
  }, [copiedRoomId]);

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!isAuthorized) {
      return;
    }

    const container = splitContainerRef.current;
    if (!container) {
      return;
    }

    const updateWidth = () => {
      setSplitContainerWidth(container.getBoundingClientRect().width);
    };

    updateWidth();

    if (typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver(() => {
      updateWidth();
    });

    observer.observe(container);

    return () => observer.disconnect();
  }, [isAuthorized, isSupportPanelOpen, isWorkspaceVisible, isVideoVisible, viewportWidth]);

  useEffect(() => {
    if (!isResizingSplit) {
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      const container = splitContainerRef.current;
      if (!container) {
        return;
      }

      const rect = container.getBoundingClientRect();
      if (rect.width <= 0) {
        return;
      }

      const next = ((event.clientX - rect.left) / rect.width) * 100;
      setWorkspaceWidthRatio(clamp(next, splitBounds.minRatio, splitBounds.maxRatio));
    };

    const handlePointerUp = () => {
      setIsResizingSplit(false);
    };

    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizingSplit, splitBounds.maxRatio, splitBounds.minRatio]);

  useEffect(() => {
    if (!isWorkspaceVisible || !isVideoVisible) {
      setIsResizingSplit(false);
    }
  }, [isVideoVisible, isWorkspaceVisible]);

  const participants = useMemo(
    () => [
      {
        id: "part-main",
        name: lesson.teacherName,
        role: "Преподаватель",
        avatarUrl: teacherAvatarUrl ?? "/avatars/avatar-2.svg",
        muted: false
      },
      { id: "part-1", name: "Егор", role: "Ученик", avatarUrl: "/avatars/avatar-5.svg", muted: true },
      { id: "part-2", name: "Алина", role: "Ученик", avatarUrl: "/avatars/avatar-7.svg", muted: false },
      { id: "part-3", name: "Вы", role: "Ученик", avatarUrl: studentProfile.avatarUrl, muted: !isMicEnabled }
    ],
    [isMicEnabled, lesson.teacherName, teacherAvatarUrl]
  );

  const canInteract = connectionState === "connected";
  const transcriptSegments = useMemo(() => getTranscriptSegments(lesson), [lesson]);
  const currentQuestion = groupTestQuestions[quizIndex];
  const quizIsChecked = Boolean(quizChecked[currentQuestion.id]);
  const selectedAnswer = quizAnswers[currentQuestion.id];

  const groupProgress = useMemo(() => {
    const checkedCount = Object.values(quizChecked).filter(Boolean).length;
    const correctCount = groupTestQuestions.filter((question) => {
      if (!quizChecked[question.id]) {
        return false;
      }
      return quizAnswers[question.id] === question.correctOptionIndex;
    }).length;

    return { checkedCount, correctCount };
  }, [quizAnswers, quizChecked]);

  const selectedNote = selectedNoteId ? boardNotes.find((note) => note.id === selectedNoteId) : null;
  const boardZoomPercent = `${Math.round(boardScale * 100)}%`;
  const isVideoOnlyMode = isVideoVisible && !isWorkspaceVisible && !isSupportPanelOpen;
  const isVideoWithChatMode = isVideoVisible && isSupportPanelOpen;
  const isVideoWithWorkspaceMode = isVideoVisible && isWorkspaceVisible;
  const isVideoStandaloneMode = isVideoVisible && !isWorkspaceVisible;
  const showWorkspaceToolbar = !isVideoOnlyMode;
  const participantsCount = Math.max(0, participants.length - 1);

  const videoStageClassName = cn(
    "relative w-full overflow-hidden rounded-xl",
    isVideoOnlyMode
      ? "mx-auto aspect-[4/3] max-h-[62vh] max-w-[920px]"
      : isVideoWithChatMode && isVideoWithWorkspaceMode
        ? "aspect-[5/4] max-h-[44vh] max-w-[700px]"
        : isVideoWithChatMode
          ? "aspect-[16/10] max-h-[48vh] max-w-[820px]"
          : "aspect-video max-h-[56vh] max-w-[980px]"
  );

  const participantsGridClassName = cn(
    "mt-2 grid justify-center gap-2 overflow-y-auto pr-1",
    isVideoOnlyMode ? "max-h-40 [grid-template-columns:repeat(auto-fit,minmax(170px,220px))]" : "",
    isVideoWithChatMode ? "max-h-36 [grid-template-columns:repeat(auto-fit,minmax(120px,156px))]" : "",
    !isVideoOnlyMode && !isVideoWithChatMode ? "max-h-44 [grid-template-columns:repeat(auto-fit,minmax(138px,182px))]" : ""
  );

  useEffect(() => {
    if (isVideoOnlyMode) {
      setAreParticipantTilesVisible(false);
    }
  }, [isVideoOnlyMode]);

  useEffect(() => {
    if (!isWorkspaceVisible || !isVideoVisible) {
      return;
    }

    setWorkspaceWidthRatio((prev) => clamp(prev, splitBounds.minRatio, splitBounds.maxRatio));
  }, [isVideoVisible, isWorkspaceVisible, splitBounds.maxRatio, splitBounds.minRatio]);

  const handleSendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canInteract) {
      return;
    }

    const text = draftMessage.trim();
    if (!text) {
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        author: "Вы",
        text,
        time: formatTime(),
        mine: true
      }
    ]);
    setDraftMessage("");
  };

  const handleAuthorizeAccess = () => {
    setIsAuthorized(true);
    window.sessionStorage.setItem(roomAccessKey, studentProfile.id);
    setConnectionState("connecting");
  };

  const handleReconnect = () => {
    setConnectionState("reconnecting");
  };

  const handleCopyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      setCopiedRoomId(true);
    } catch {
      setCopiedRoomId(false);
    }
  };

  const getBoardPointFromClient = (clientX: number, clientY: number) => {
    const viewport = boardViewportRef.current;
    if (!viewport) {
      return { boardX: 0, boardY: 0, screenX: 0, screenY: 0 };
    }

    const rect = viewport.getBoundingClientRect();
    const screenX = clientX - rect.left;
    const screenY = clientY - rect.top;

    return {
      boardX: (screenX - boardOffset.x) / boardScale,
      boardY: (screenY - boardOffset.y) / boardScale,
      screenX,
      screenY
    };
  };

  const applyBoardZoom = (nextScaleRaw: number, pivotScreenPoint?: { x: number; y: number }) => {
    const viewport = boardViewportRef.current;
    const nextScale = clamp(nextScaleRaw, 0.55, 2.1);

    if (!viewport) {
      setBoardScale(nextScale);
      return;
    }

    const rect = viewport.getBoundingClientRect();
    const pivotX = pivotScreenPoint?.x ?? rect.width / 2;
    const pivotY = pivotScreenPoint?.y ?? rect.height / 2;
    const pivotBoardX = (pivotX - boardOffset.x) / boardScale;
    const pivotBoardY = (pivotY - boardOffset.y) / boardScale;

    setBoardScale(nextScale);
    setBoardOffset({
      x: pivotX - pivotBoardX * nextScale,
      y: pivotY - pivotBoardY * nextScale
    });
  };

  const handleBoardWheel = (event: WheelEvent<HTMLDivElement>) => {
    event.preventDefault();

    const viewport = boardViewportRef.current;
    if (!viewport) {
      return;
    }

    const rect = viewport.getBoundingClientRect();
    const pivot = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };

    const nextScale = boardScale + (event.deltaY < 0 ? 0.08 : -0.08);
    applyBoardZoom(nextScale, pivot);
  };

  const handleBoardPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!canInteract || event.button !== 0) {
      return;
    }

    const viewport = boardViewportRef.current;
    if (!viewport) {
      return;
    }

    const point = getBoardPointFromClient(event.clientX, event.clientY);

    if (boardTool === "sticky") {
      const newNote: BoardNote = {
        id: `note-${Date.now()}`,
        x: point.boardX - 82,
        y: point.boardY - 40,
        color: boardNoteColors[Date.now() % boardNoteColors.length],
        text: "Новый стикер"
      };
      setBoardNotes((prev) => [...prev, newNote]);
      setSelectedNoteId(newNote.id);
      return;
    }

    if (boardTool === "pen") {
      const pathId = `path-${Date.now()}`;
      setBoardPaths((prev) => [
        ...prev,
        {
          id: pathId,
          color: boardStrokeColor,
          size: boardStrokeSize,
          points: [{ x: point.boardX, y: point.boardY }]
        }
      ]);
      boardInteractionRef.current = {
        mode: "draw",
        pointerId: event.pointerId,
        pathId
      };
      viewport.setPointerCapture(event.pointerId);
      return;
    }

    boardInteractionRef.current = {
      mode: "pan",
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startOffsetX: boardOffset.x,
      startOffsetY: boardOffset.y
    };
    viewport.setPointerCapture(event.pointerId);
  };

  const handleBoardPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const interaction = boardInteractionRef.current;
    if (!interaction || interaction.pointerId !== event.pointerId) {
      return;
    }

    if (interaction.mode === "pan") {
      setBoardOffset({
        x: interaction.startOffsetX + (event.clientX - interaction.startClientX),
        y: interaction.startOffsetY + (event.clientY - interaction.startClientY)
      });
      return;
    }

    const point = getBoardPointFromClient(event.clientX, event.clientY);

    if (interaction.mode === "draw") {
      setBoardPaths((prev) =>
        prev.map((path) => {
          if (path.id !== interaction.pathId) {
            return path;
          }

          const lastPoint = path.points[path.points.length - 1];
          if (!lastPoint) {
            return path;
          }

          const distance = Math.hypot(lastPoint.x - point.boardX, lastPoint.y - point.boardY);
          if (distance < 0.85) {
            return path;
          }

          return {
            ...path,
            points: [...path.points, { x: point.boardX, y: point.boardY }]
          };
        })
      );
      return;
    }

    if (interaction.mode === "drag-note") {
      setBoardNotes((prev) =>
        prev.map((note) => {
          if (note.id !== interaction.noteId) {
            return note;
          }

          return {
            ...note,
            x: point.boardX - interaction.noteOffsetX,
            y: point.boardY - interaction.noteOffsetY
          };
        })
      );
    }
  };

  const stopBoardInteraction = (event: ReactPointerEvent<HTMLDivElement>) => {
    const interaction = boardInteractionRef.current;
    if (!interaction || interaction.pointerId !== event.pointerId) {
      return;
    }

    boardInteractionRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleNotePointerDown = (event: ReactPointerEvent<HTMLButtonElement>, noteId: string) => {
    event.preventDefault();
    event.stopPropagation();

    if (!canInteract) {
      return;
    }

    const point = getBoardPointFromClient(event.clientX, event.clientY);
    const note = boardNotes.find((item) => item.id === noteId);
    if (!note) {
      return;
    }

    setSelectedNoteId(noteId);
    boardInteractionRef.current = {
      mode: "drag-note",
      pointerId: event.pointerId,
      noteId,
      noteOffsetX: point.boardX - note.x,
      noteOffsetY: point.boardY - note.y
    };

    boardViewportRef.current?.setPointerCapture(event.pointerId);
  };

  const clearBoardStrokes = () => {
    setBoardPaths([]);
  };

  const clearBoardAll = () => {
    setBoardPaths([]);
    setBoardNotes([]);
    setSelectedNoteId(null);
  };

  const resetBoardViewport = () => {
    setBoardScale(1);
    setBoardOffset(defaultBoardOffset);
  };

  const handleSplitResizeStart = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (window.innerWidth < 1024) {
      return;
    }

    event.preventDefault();
    setIsResizingSplit(true);
  };

  const handleToggleWorkspace = () => {
    setIsWorkspaceVisible((prev) => {
      if (prev && !isVideoVisible) {
        return prev;
      }
      return !prev;
    });
  };

  const handleToggleVideo = () => {
    setIsVideoVisible((prev) => {
      if (prev && !isWorkspaceVisible) {
        return prev;
      }
      return !prev;
    });
  };

  if (lesson.status === "cancelled") {
    return (
      <section className="rounded-[2rem] border border-border bg-[#eceef3] p-4 shadow-card sm:p-6">
        <article className="mx-auto max-w-2xl rounded-[1.8rem] border border-border bg-white p-8 shadow-card">
          <h1 className="text-2xl font-semibold text-foreground">Урок отменен</h1>
          <p className="mt-2 text-sm text-muted-foreground">Подключение к комнате недоступно, потому что занятие было отменено.</p>
          <Link href={backHref} className="mt-4 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
            Вернуться к материалам
          </Link>
        </article>
      </section>
    );
  }

  return (
    <section
      className={cn(
        "rounded-[2rem] border border-border bg-[#eceef3] p-4 shadow-card sm:p-6",
        isAuthorized
          ? "flex h-[calc(100dvh-1rem)] flex-col overflow-hidden sm:h-[calc(100dvh-1.5rem)] lg:h-[calc(100dvh-2rem)]"
          : ""
      )}
    >
      {!isAuthorized ? (
        <article className="mx-auto max-w-2xl rounded-[1.8rem] border border-border bg-white p-8 shadow-card">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Проверка доступа</p>
              <h1 className="mt-1 text-2xl font-semibold text-foreground">Комната доступна только участникам урока</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Подтвердите вход как <span className="font-semibold text-foreground">{studentProfile.name}</span>, чтобы подключиться к сессии.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 rounded-2xl border border-border bg-slate-50 p-4 sm:grid-cols-3">
            <div>
              <p className="text-xs text-muted-foreground">Комната</p>
              <p className="mt-1 text-sm font-semibold text-foreground">{roomId}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Предмет</p>
              <p className="mt-1 text-sm font-semibold text-foreground">{lesson.subject}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Время</p>
              <p className="mt-1 text-sm font-semibold text-foreground">
                {formatDateLabel(lesson.startAt)} • {formatLessonTime(lesson.startAt)}
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleAuthorizeAccess}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              <CheckCircle2 className="h-4 w-4" />
              Подтвердить и войти
            </button>
            <Link href={backHref} className="inline-flex items-center rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold text-foreground">
              Вернуться к уроку
            </Link>
          </div>
        </article>
      ) : null}

      {isAuthorized ? (
        <>
          <div className="shrink-0 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Link
                href={backHref}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white text-muted-foreground transition hover:text-foreground"
                aria-label="Назад к материалам урока"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Онлайн-занятие</p>
                <h1 className="text-2xl font-semibold text-foreground">{lesson.subject}: живая сессия</h1>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className={cn("rounded-full border px-3 py-1.5 text-xs font-semibold", getConnectionClasses(connectionState))}>
                {connectionState === "connecting" || connectionState === "reconnecting" ? (
                  <Loader2 className="mr-1 inline h-3.5 w-3.5 animate-spin" />
                ) : null}
                {getConnectionLabel(connectionState)}
              </span>
              <span className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-foreground">
                {formatDateLabel(lesson.startAt)}
              </span>
              <button
                type="button"
                onClick={handleCopyRoomId}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-foreground"
              >
                <Copy className="h-3.5 w-3.5" />
                {copiedRoomId ? "Скопировано" : roomId}
              </button>
              <button
                type="button"
                onClick={handleReconnect}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-foreground"
              >
                <RefreshCcw className="h-3.5 w-3.5" />
                Переподключить
              </button>
              <button
                type="button"
                onClick={handleToggleWorkspace}
                disabled={isWorkspaceVisible && !isVideoVisible}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-foreground disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isWorkspaceVisible ? <PanelLeftClose className="h-3.5 w-3.5" /> : <PanelLeftOpen className="h-3.5 w-3.5" />}
                {isWorkspaceVisible ? "Скрыть доску/тест" : "Показать доску/тест"}
              </button>
              <button
                type="button"
                onClick={handleToggleVideo}
                disabled={isVideoVisible && !isWorkspaceVisible}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-foreground disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isVideoVisible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                {isVideoVisible ? "Скрыть видео" : "Показать видео"}
              </button>
              <button
                type="button"
                onClick={() => setIsSupportPanelOpen((prev) => !prev)}
                className="inline-flex items-center gap-1 rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-foreground"
              >
                {isSupportPanelOpen ? <PanelRightClose className="h-3.5 w-3.5" /> : <PanelRightOpen className="h-3.5 w-3.5" />}
                {isSupportPanelOpen ? "Скрыть чат" : "Показать чат"}
              </button>
            </div>
          </div>

          <div className={cn("mt-4 grid min-h-0 flex-1 gap-4 overflow-hidden", isSupportPanelOpen ? "2xl:grid-cols-[minmax(0,1fr)_340px]" : "") }>
            <article className={cn("flex min-h-0 flex-col rounded-[1.8rem] border border-border bg-white shadow-card", showWorkspaceToolbar ? "p-3 sm:p-4" : "p-2 sm:p-3")}>
              {showWorkspaceToolbar ? (
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-border bg-slate-50 p-2.5">
                  <div className="flex gap-2">
                    {[
                      { id: "board", label: "Интерактивная доска" },
                      { id: "quiz", label: "Совместный тест" }
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveWorkspace(item.id as WorkspaceTab)}
                        className={cn(
                          "rounded-full px-4 py-2 text-sm font-semibold transition",
                          activeWorkspace === item.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-white"
                        )}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Экран разделен: преподаватель и рабочая зона видны одновременно. Можно скрывать лишние блоки и менять размеры.
                  </p>
                </div>
              ) : null}

	              <div
                  ref={splitContainerRef}
                  className={cn(
                    "flex min-h-0 flex-1 flex-col gap-3 lg:flex-row",
                    showWorkspaceToolbar ? "mt-3" : "mt-0",
                    isVideoStandaloneMode ? "items-center justify-center" : "",
                    isWorkspaceVisible && isVideoVisible ? "lg:gap-2" : ""
                  )}
                >
	                {isWorkspaceVisible ? (
	                  <section
                    className="min-h-0 min-w-0 w-full"
                    style={isVideoVisible ? { flex: `0 1 ${effectiveWorkspaceRatio}%` } : { flex: "1 1 auto" }}
                  >
	                  {activeWorkspace === "board" ? (
                    <article className="flex h-full w-full min-w-0 flex-col rounded-[1.4rem] border border-border bg-slate-50/70 p-3">
                      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-white p-2">
                        {[
                          { id: "pan", label: "Панорама", icon: Move },
                          { id: "pen", label: "Маркер", icon: Pencil },
                          { id: "sticky", label: "Стикер", icon: StickyNote }
                        ].map((tool) => {
                          const Icon = tool.icon;
                          return (
                            <button
                              key={tool.id}
                              type="button"
                              onClick={() => setBoardTool(tool.id as BoardTool)}
                              className={cn(
                                "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold transition",
                                boardTool === tool.id ? "bg-primary text-primary-foreground" : "border border-border text-foreground"
                              )}
                            >
                              <Icon className="h-3.5 w-3.5" />
                              {tool.label}
                            </button>
                          );
                        })}

                        <div className="ml-auto flex items-center gap-1 rounded-full border border-border bg-slate-50 px-2 py-1">
                          <button
                            type="button"
                            onClick={() => applyBoardZoom(boardScale - 0.1)}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-white"
                            aria-label="Уменьшить масштаб"
                          >
                            <ZoomOut className="h-4 w-4" />
                          </button>
                          <span className="min-w-[52px] text-center text-xs font-semibold text-foreground">{boardZoomPercent}</span>
                          <button
                            type="button"
                            onClick={() => applyBoardZoom(boardScale + 0.1)}
                            className="inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-white"
                            aria-label="Увеличить масштаб"
                          >
                            <ZoomIn className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-2 rounded-xl border border-border bg-white p-2">
                        {boardPenColors.map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setBoardStrokeColor(color)}
                            className={cn(
                              "h-7 w-7 rounded-full border-2 transition",
                              boardStrokeColor === color ? "border-slate-900" : "border-transparent"
                            )}
                            style={{ backgroundColor: color }}
                            aria-label={`Цвет маркера ${color}`}
                          />
                        ))}
                        <label className="ml-1 inline-flex items-center gap-2 text-xs text-muted-foreground">
                          Толщина
                          <input
                            type="range"
                            min={2}
                            max={14}
                            value={boardStrokeSize}
                            onChange={(event) => setBoardStrokeSize(Number(event.target.value))}
                            className="w-24"
                          />
                        </label>

                        <button
                          type="button"
                          onClick={clearBoardStrokes}
                          className="ml-auto inline-flex items-center gap-1 rounded-full border border-border bg-slate-50 px-3 py-1.5 text-xs font-semibold text-foreground"
                        >
                          <Eraser className="h-3.5 w-3.5" />
                          Стереть штрихи
                        </button>
                        <button
                          type="button"
                          onClick={clearBoardAll}
                          className="inline-flex items-center rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-foreground"
                        >
                          Очистить всё
                        </button>
                        <button
                          type="button"
                          onClick={resetBoardViewport}
                          className="inline-flex items-center rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-foreground"
                        >
                          Центрировать
                        </button>
                      </div>

                      <div
                        ref={boardViewportRef}
                        onPointerDown={handleBoardPointerDown}
                        onPointerMove={handleBoardPointerMove}
                        onPointerUp={stopBoardInteraction}
                        onPointerCancel={stopBoardInteraction}
                        onWheel={handleBoardWheel}
                        className={cn(
                          "relative mt-3 min-h-[220px] flex-1 overflow-hidden rounded-2xl border border-border bg-white touch-none sm:min-h-[280px] lg:min-h-[320px]",
                          boardTool === "pan" ? "cursor-grab" : "cursor-crosshair"
                        )}
                      >
                        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(148,163,184,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.16)_1px,transparent_1px)] [background-size:34px_34px]" />

                        <div
                          className="absolute left-0 top-0 h-[1500px] w-[2600px]"
                          style={{
                            transform: `translate(${boardOffset.x}px, ${boardOffset.y}px) scale(${boardScale})`,
                            transformOrigin: "0 0"
                          }}
                        >
                          <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 2600 1500" fill="none">
                            {boardPaths.map((path) => (
                              <path
                                key={path.id}
                                d={buildPath(path.points)}
                                stroke={path.color}
                                strokeWidth={path.size}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            ))}
                          </svg>

                          {boardNotes.map((note) => (
                            <article
                              key={note.id}
                              className={cn(
                                "absolute w-[180px] rounded-xl border border-slate-300 p-2 shadow-sm",
                                selectedNoteId === note.id ? "ring-2 ring-primary/45" : ""
                              )}
                              style={{ left: note.x, top: note.y, backgroundColor: note.color }}
                            >
                              <div className="mb-1 flex items-center justify-between">
                                <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-700">Стикер</p>
                                <button
                                  type="button"
                                  onPointerDown={(event) => handleNotePointerDown(event, note.id)}
                                  className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-400/60 bg-white/70 text-slate-700"
                                  aria-label="Переместить стикер"
                                >
                                  <Move className="h-3.5 w-3.5" />
                                </button>
                              </div>
                              <textarea
                                value={note.text}
                                onClick={() => setSelectedNoteId(note.id)}
                                onPointerDown={(event) => event.stopPropagation()}
                                onChange={(event) =>
                                  setBoardNotes((prev) =>
                                    prev.map((item) => (item.id === note.id ? { ...item, text: event.target.value } : item))
                                  )
                                }
                                className="h-16 w-full resize-none rounded-lg border border-slate-300/70 bg-white/70 px-2 py-1 text-xs text-slate-800 outline-none focus:border-primary"
                              />
                            </article>
                          ))}
                        </div>
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span className="rounded-full border border-border bg-white px-3 py-1.5">Колесо мыши: масштаб</span>
                        <span className="rounded-full border border-border bg-white px-3 py-1.5">Инструмент “Панорама”: перемещение доски</span>
                        <span className="rounded-full border border-border bg-white px-3 py-1.5">Стикеры и маркер синхронизируются в группе</span>
                      </div>

                      {selectedNote ? (
                        <div className="mt-2 rounded-xl border border-border bg-white px-3 py-2 text-xs text-muted-foreground">
                          Выбран стикер: <span className="font-semibold text-foreground">{selectedNote.text || "Без текста"}</span>
                        </div>
                      ) : null}
                    </article>
                  ) : (
                    <article className="flex h-full w-full min-w-0 flex-col rounded-[1.4rem] border border-border bg-slate-50/70 p-3">
                      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-white p-3">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">
                            Вопрос {quizIndex + 1} из {groupTestQuestions.length}
                          </p>
                          <h2 className="mt-1 text-base font-semibold text-foreground">{currentQuestion.prompt}</h2>
                        </div>
                        <p className="rounded-full border border-border bg-slate-50 px-3 py-1 text-xs font-semibold text-foreground">
                          Прогресс: {groupProgress.checkedCount}/{groupTestQuestions.length}
                        </p>
                      </div>

                      <div className="mt-3 grid flex-1 gap-3 xl:grid-cols-[1.2fr_0.8fr]">
                        <div className="rounded-xl border border-border bg-white p-3">
                          <div className="space-y-2">
                            {currentQuestion.options.map((option, index) => (
                              <label
                                key={option}
                                className={cn(
                                  "flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm transition",
                                  selectedAnswer === index ? "border-primary/40 bg-primary/5" : "border-border bg-white"
                                )}
                              >
                                <input
                                  type="radio"
                                  name={currentQuestion.id}
                                  checked={selectedAnswer === index}
                                  onChange={() => setQuizAnswers((prev) => ({ ...prev, [currentQuestion.id]: index }))}
                                  className="h-4 w-4 border-border text-primary"
                                />
                                <span>{option}</span>
                              </label>
                            ))}
                          </div>

                          <div className="mt-3 flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => setQuizChecked((prev) => ({ ...prev, [currentQuestion.id]: true }))}
                              disabled={selectedAnswer === undefined}
                              className="inline-flex rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-60"
                            >
                              Проверить ответ
                            </button>
                            <button
                              type="button"
                              onClick={() => setQuizIndex((prev) => Math.max(prev - 1, 0))}
                              disabled={quizIndex <= 0}
                              className="inline-flex rounded-full border border-border bg-white px-4 py-2 text-xs font-semibold text-foreground disabled:opacity-60"
                            >
                              Назад
                            </button>
                            <button
                              type="button"
                              onClick={() => setQuizIndex((prev) => Math.min(prev + 1, groupTestQuestions.length - 1))}
                              disabled={quizIndex >= groupTestQuestions.length - 1}
                              className="inline-flex rounded-full border border-border bg-white px-4 py-2 text-xs font-semibold text-foreground disabled:opacity-60"
                            >
                              Следующий вопрос
                            </button>
                          </div>

                          {quizIsChecked ? (
                            <p
                              className={cn(
                                "mt-3 rounded-xl border px-3 py-2 text-xs",
                                selectedAnswer === currentQuestion.correctOptionIndex
                                  ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                                  : "border-rose-300 bg-rose-50 text-rose-700"
                              )}
                            >
                              {selectedAnswer === currentQuestion.correctOptionIndex ? "Верно. " : "Нужно поправить. "}
                              {currentQuestion.explanation}
                            </p>
                          ) : null}
                        </div>

                        <div className="space-y-3">
                          <article className="rounded-xl border border-border bg-white p-3">
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Ответы группы (демо)</p>
                            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                              <li>• {lesson.teacherName}: подтвердил корректный вариант</li>
                              <li>• Егор: выбирает вариант B</li>
                              <li>• Алина: выбирает вариант A</li>
                            </ul>
                            <p className="mt-3 text-sm font-semibold text-foreground">
                              Текущий счёт: {groupProgress.correctCount}/{groupTestQuestions.length} правильных
                            </p>
                          </article>

                          <article className="rounded-xl border border-border bg-white p-3">
                            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Режим совместного решения</p>
                            <p className="mt-2 text-sm text-muted-foreground">
                              Преподаватель ведет разбор в видео-окне справа, а результаты группы сразу фиксируются в тесте.
                            </p>
                          </article>
                        </div>
                      </div>
                    </article>
                  )}
	                  </section>
	                ) : null}

	                {isWorkspaceVisible && isVideoVisible ? (
	                  <button
	                    type="button"
	                    onPointerDown={handleSplitResizeStart}
	                    className="hidden w-2 items-center justify-center rounded-full border border-border bg-slate-50 text-muted-foreground lg:flex"
	                    aria-label="Изменить ширину панелей"
	                  >
	                    <GripVertical className="h-4 w-4" />
	                  </button>
	                ) : null}

	                {isVideoVisible ? (
	                  <section
                    className={cn(
                      "flex min-h-0 min-w-0 w-full",
                      isVideoStandaloneMode ? "mx-auto h-full max-w-[980px] items-center justify-center self-center" : ""
                    )}
                    style={isWorkspaceVisible ? { flex: `1 1 ${100 - effectiveWorkspaceRatio}%` } : { flex: "1 1 auto" }}
                  >
                  <article className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-[1.4rem] border border-slate-700 bg-slate-900 p-3 text-white shadow-soft">
                    <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-slate-950 p-2">
                      <div className={videoStageClassName}>
                        <Image
                          src="/classroom-preview.svg"
                          alt={`Видеопоток урока: ${lesson.subject}`}
                          width={980}
                          height={690}
                          className="h-full w-full object-cover opacity-35"
                        />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_35%),linear-gradient(180deg,rgba(17,24,39,0.08),rgba(2,6,23,0.74))]" />

                        <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold text-slate-900">
                          Ведёт: {lesson.teacherName}
                        </div>
                        <div className="absolute right-3 top-3 rounded-full bg-emerald-500/90 px-3 py-1 text-[11px] font-semibold">
                          Онлайн
                        </div>

                        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-col items-center">
                          <Image
                            src={teacherAvatarUrl ?? "/avatars/avatar-2.svg"}
                            alt={`Преподаватель ${lesson.teacherName}`}
                            width={94}
                            height={94}
                            className="h-20 w-20 rounded-full border-4 border-white/70 bg-white/80"
                          />
                          <p className="mt-2 text-sm font-semibold text-white">{lesson.teacherName}</p>
                          <p className="text-[11px] text-white/80">Разбор темы и ответы на вопросы</p>
                        </div>
                      </div>
                    </div>

	                    <div className="mt-2 flex justify-end">
	                      <button
	                        type="button"
	                        onClick={() => setAreParticipantTilesVisible((prev) => !prev)}
	                        className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-semibold text-white/90 transition hover:bg-white/15"
	                      >
	                        <Rows3 className="h-3.5 w-3.5" />
	                        {areParticipantTilesVisible ? "Скрыть участников" : `Показать участников (${participantsCount})`}
	                      </button>
	                    </div>

	                    {areParticipantTilesVisible ? (
	                      <div className={participantsGridClassName}>
	                        {participants.slice(1).map((participant) => (
	                          <article key={participant.id} className="relative overflow-hidden rounded-xl border border-white/10 bg-white/10 p-1.5">
	                            <div className="absolute right-2 top-2 rounded-full bg-slate-900/70 px-2 py-0.5 text-[10px]">
	                              {participant.muted ? "Без звука" : "Со звуком"}
	                            </div>
	                            <div className="relative flex aspect-[4/3] items-center justify-center rounded-lg bg-white/10">
	                              <Image
	                                src={participant.avatarUrl}
	                                alt={`Участник ${participant.name}`}
	                                width={58}
	                                height={58}
	                                className="h-12 w-12 rounded-full border border-white/60 bg-white/80"
	                              />
	                            </div>
	                            <p className="mt-1 truncate px-1 text-center text-[11px] font-semibold text-white">{participant.name}</p>
                              <p className="truncate px-1 text-center text-[10px] text-white/70">{participant.role}</p>
	                          </article>
	                        ))}
	                      </div>
	                    ) : null}

                    <div className="mt-3 flex flex-wrap items-center justify-center gap-2 rounded-xl bg-white/10 p-2">
                      <ControlButton
                        active={isCameraEnabled}
                        onClick={() => setIsCameraEnabled((prev) => !prev)}
                        label={isCameraEnabled ? "Выключить камеру" : "Включить камеру"}
                        disabled={!canInteract}
                        icon={isCameraEnabled ? Video : VideoOff}
                      />
                      <ControlButton
                        active={isMicEnabled}
                        onClick={() => setIsMicEnabled((prev) => !prev)}
                        label={isMicEnabled ? "Выключить микрофон" : "Включить микрофон"}
                        disabled={!canInteract}
                        icon={isMicEnabled ? Mic : MicOff}
                      />
                      <ControlButton
                        active={isHandRaised}
                        onClick={() => setIsHandRaised((prev) => !prev)}
                        label={isHandRaised ? "Опустить руку" : "Поднять руку"}
                        disabled={!canInteract}
                        icon={Hand}
                      />
                      <ControlButton label="Открыть чат" onClick={() => setActiveSideTab("chat")} icon={MessageCircle} />
                      <ControlButton label="Ещё действия" disabled={!canInteract} icon={MoreVertical} />
                      <ControlButton danger label="Завершить звонок" icon={PhoneOff} />
                    </div>
                  </article>
	                  </section>
	                ) : null}

	                {!isWorkspaceVisible && !isVideoVisible ? (
	                  <div className="flex flex-1 items-center justify-center rounded-[1.4rem] border border-dashed border-border bg-white/80 p-6 text-center text-sm text-muted-foreground">
	                    Покажите хотя бы один блок: видео преподавателя или рабочую зону.
	                  </div>
	                ) : null}
	              </div>
            </article>

            {isSupportPanelOpen ? (
              <aside className="flex min-h-0 h-full flex-col overflow-hidden rounded-[1.8rem] border border-border bg-[#dde0e7] p-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex gap-1 rounded-full border border-border bg-white p-1">
                    <button
                      type="button"
                      onClick={() => setActiveSideTab("chat")}
                      className={cn(
                        "rounded-full px-3 py-1.5 text-xs font-semibold transition",
                        activeSideTab === "chat" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                      )}
                    >
                      Чат
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSideTab("artifacts")}
                      className={cn(
                        "rounded-full px-3 py-1.5 text-xs font-semibold transition",
                        activeSideTab === "artifacts" ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                      )}
                    >
                      Артефакты урока
                    </button>
                  </div>

                  <button
                    type="button"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white text-muted-foreground"
                    aria-label="Дополнительные действия"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>

                {activeSideTab === "chat" ? (
                  <>
                    <div className="mt-4 flex-1 space-y-3 overflow-auto pr-1">
                      {messages.map((message) => (
                        <div key={message.id} className={cn("flex gap-2", message.mine ? "justify-end" : "justify-start")}>
                          {!message.mine ? (
                            <Image
                              src={message.avatarUrl ?? "/avatars/avatar-8.svg"}
                              alt={`Аватар ${message.author}`}
                              width={34}
                              height={34}
                              className="mt-1 h-8 w-8 rounded-full border border-white/60 bg-white"
                            />
                          ) : null}

                          <article
                            className={cn(
                              "max-w-[85%] rounded-2xl px-3 py-2",
                              message.mine ? "rounded-br-md bg-primary text-primary-foreground" : "rounded-bl-md bg-white text-foreground"
                            )}
                          >
                            <p className={cn("text-sm font-semibold", message.mine ? "text-primary-foreground" : "text-foreground")}>{message.author}</p>
                            <p className={cn("mt-1 text-sm", message.mine ? "text-primary-foreground/90" : "text-muted-foreground")}>{message.text}</p>
                            <p className={cn("mt-1 text-right text-[11px]", message.mine ? "text-primary-foreground/75" : "text-muted-foreground")}>{message.time}</p>
                          </article>
                        </div>
                      ))}
                    </div>

                    <form onSubmit={handleSendMessage} className="mt-4 flex items-center gap-2">
                      <button
                        type="button"
                        disabled={!canInteract}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-muted-foreground disabled:opacity-50"
                        aria-label="Прикрепить файл"
                      >
                        <Paperclip className="h-4 w-4" />
                      </button>
                      <input
                        type="text"
                        value={draftMessage}
                        onChange={(event) => setDraftMessage(event.target.value)}
                        placeholder="Введите сообщение..."
                        disabled={!canInteract}
                        className="h-11 flex-1 rounded-full border border-border bg-white px-4 text-sm outline-none transition focus:border-primary disabled:opacity-60"
                      />
                      <button
                        type="submit"
                        disabled={!canInteract}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-white transition hover:bg-slate-700 disabled:opacity-50"
                        aria-label="Отправить сообщение"
                      >
                        <SendHorizontal className="h-4 w-4" />
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="mt-4 flex flex-1 flex-col overflow-hidden">
                    <div className="grid grid-cols-2 gap-2">
                      <article className="rounded-xl border border-border bg-white p-2">
                        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Транскрипт</p>
                        <p className="mt-1 text-sm font-semibold text-foreground">{transcriptSegments.length} фрагмента</p>
                      </article>
                      <article className="rounded-xl border border-border bg-white p-2">
                        <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Домашние задания</p>
                        <p className="mt-1 text-sm font-semibold text-foreground">{homework.length} по уроку</p>
                      </article>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1.5 rounded-xl border border-border bg-white p-1.5">
                      {[
                        { id: "transcript", label: "Транскрипт" },
                        { id: "summary", label: "Конспект" },
                        { id: "recommendations", label: "ИИ" },
                        { id: "vocabulary", label: "Словарь" },
                        { id: "homework", label: "Домашка" }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setActiveArtifactTab(tab.id as ArtifactTab)}
                          className={cn(
                            "rounded-full px-2.5 py-1 text-[11px] font-semibold transition",
                            activeArtifactTab === tab.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-slate-50"
                          )}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    <div className="mt-3 flex-1 overflow-auto pr-1">
                      {activeArtifactTab === "transcript" ? (
                        <article className="rounded-2xl border border-border bg-white p-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Транскрипт (черновик)</p>
                          <div className="mt-2 space-y-2">
                            {transcriptSegments.map((segment) => (
                              <div key={segment.id} className="rounded-xl border border-border bg-slate-50 p-2">
                                <p className="text-[11px] font-semibold text-muted-foreground">
                                  {segment.time} • {segment.speaker}
                                </p>
                                <p className="mt-1 text-sm text-foreground">{segment.text}</p>
                              </div>
                            ))}
                          </div>
                        </article>
                      ) : null}

                      {activeArtifactTab === "summary" ? (
                        <article className="rounded-2xl border border-border bg-white p-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Конспект урока</p>
                          <p className="mt-2 text-sm text-foreground">{lesson.summarySnippet}</p>
                          <button
                            type="button"
                            className="mt-3 inline-flex rounded-full border border-border bg-slate-50 px-3 py-1.5 text-xs font-semibold text-foreground"
                          >
                            Экспорт конспекта (демо)
                          </button>
                        </article>
                      ) : null}

                      {activeArtifactTab === "recommendations" ? (
                        <article className="rounded-2xl border border-border bg-white p-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Рекомендации ИИ</p>
                          <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
                            {lesson.recommendations.map((item) => (
                              <li key={item} className="rounded-xl border border-border bg-slate-50 p-2">
                                <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                                  Следующий шаг
                                </span>
                                <p className="mt-1">{item}</p>
                              </li>
                            ))}
                          </ul>
                        </article>
                      ) : null}

                      {activeArtifactTab === "vocabulary" ? (
                        <article className="rounded-2xl border border-border bg-white p-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Словарь урока</p>
                          {vocabulary.length > 0 ? (
                            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                              {vocabulary.slice(0, 8).map((item) => (
                                <li key={item.id} className="rounded-xl border border-border bg-slate-50 px-2.5 py-2">
                                  <span className="font-semibold text-foreground">{item.word}</span> — {item.translation}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="mt-2 text-sm text-muted-foreground">Слова появятся после анализа занятия.</p>
                          )}
                          <Link
                            href="/app/vocabulary"
                            className="mt-3 inline-flex rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-foreground"
                          >
                            Открыть словарь
                          </Link>
                        </article>
                      ) : null}

                      {activeArtifactTab === "homework" ? (
                        <article className="rounded-2xl border border-border bg-white p-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Домашние задания</p>
                          {homework.length > 0 ? (
                            <div className="mt-2 space-y-2">
                              {homework.slice(0, 4).map((item) => (
                                <div key={item.id} className="rounded-xl border border-border bg-slate-50 p-2">
                                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                                  <p className="text-xs text-muted-foreground">Срок: {formatHomeworkDate(item.dueDate)}</p>
                                </div>
                              ))}
                              <Link
                                href="/app/homework"
                                className="inline-flex rounded-full border border-border bg-white px-3 py-1.5 text-xs font-semibold text-foreground"
                              >
                                Перейти к домашним заданиям
                              </Link>
                            </div>
                          ) : (
                            <p className="mt-2 text-sm text-muted-foreground">Домашка будет назначена после урока.</p>
                          )}
                        </article>
                      ) : null}
                    </div>
                  </div>
                )}
              </aside>
            ) : null}
          </div>
        </>
      ) : null}
    </section>
  );
}
