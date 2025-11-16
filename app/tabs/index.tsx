import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../../src/config/firebase";

const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

type CalendarCell = {
  key: string;
  date: Date | null;
};

const createCalendarMatrix = (displayDate: Date): CalendarCell[][] => {
  const year = displayDate.getFullYear();
  const month = displayDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const firstWeekDay = firstDayOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: CalendarCell[] = [];

  // Leading empty cells
  for (let i = 0; i < firstWeekDay; i += 1) {
    cells.push({ key: `prev-${i}`, date: null });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day += 1) {
    const current = new Date(year, month, day);
    cells.push({ key: `curr-${day}`, date: current });
  }

  // Trailing empty cells to fill the grid
  const totalCells = Math.ceil(cells.length / 7) * 7;
  for (let i = cells.length; i < totalCells; i += 1) {
    cells.push({ key: `next-${i}`, date: null });
  }

  const rows: CalendarCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    rows.push(cells.slice(i, i + 7));
  }

  return rows;
};

const formatMonthYear = (date: Date) => {
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${month}월 ${year}`;
};

const isSameDay = (a: Date | null, b: Date) => {
  if (!a) {
    return false;
  }
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
};

const formatDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

type CalendarEventFromServer = {
  id: string;
  date: string;
  title: string;
};

type CalendarEventDisplay = {
  id: string;
  title: string;
  color: string;
};

const EVENT_COLORS = ["#FEE2E2", "#DBEAFE", "#DCFCE7", "#FDE68A"];

const groupEventsByDate = (
  events: CalendarEventFromServer[]
): Record<string, CalendarEventDisplay[]> => {
  const record: Record<string, CalendarEventDisplay[]> = {};
  events.forEach((event) => {
    const key = event.date;
    const existing = record[key] ?? [];
    const color = EVENT_COLORS[existing.length % EVENT_COLORS.length];
    record[key] = [
      ...existing,
      {
        id: event.id,
        title: event.title,
        color,
      },
    ];
  });
  return record;
};

export default function HomeScreen() {
  const today = useMemo(() => new Date(), []);
  const [displayDate, setDisplayDate] = useState(
    () => new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(today);
  const [eventsByDate, setEventsByDate] = useState<Record<string, CalendarEventDisplay[]>>({});
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [eventsError, setEventsError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");

  const calendarRows = useMemo(() => createCalendarMatrix(displayDate), [displayDate]);

  const handleMonthChange = (offset: number) => {
    setDisplayDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoadingEvents(true);
        setEventsError(null);
        const snapshot = await getDocs(collection(db, "events"));
        const serverEvents: CalendarEventFromServer[] = snapshot.docs.map((doc) => {
          const data = doc.data() as { date?: string; title?: string };
          return {
            id: doc.id,
            date: data.date ?? "",
            title: data.title ?? "",
          };
        });
        setEventsByDate(groupEventsByDate(serverEvents));
      } catch (error) {
        console.error(error);
        setEventsError("일정을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>모든 이벤트</Text>
          <TouchableOpacity 
          style={styles.addButton}
          onPress={() => {
            if (!selectedDate) {
              Alert.alert("날짜 선택", "일정을 추가할 날짜를 선택해 주세요.");
              return;
            }
            setIsModalVisible(true);
          }}
        >
          <Text style={styles.addButtonText}>＋</Text>
        </TouchableOpacity>
              </View>

      <View style={styles.monthSelector}>
        <TouchableOpacity onPress={() => handleMonthChange(-1)}>
          <Text style={styles.arrowText}>{"<"}</Text>
        </TouchableOpacity>

        <Text style={styles.monthText}>{formatMonthYear(displayDate)}</Text>

        <TouchableOpacity onPress={() => handleMonthChange(1)}>
          <Text style={styles.arrowText}>{">"}</Text>
        </TouchableOpacity>
            </View>

      <View style={styles.calendar}>
        <View style={styles.weekRow}>
          {DAY_LABELS.map((label) => (
            <Text key={label} style={[styles.dayLabel, label === "일" && styles.sundayLabel]}>
              {label}
            </Text>
          ))}
        </View>

        {calendarRows.map((week, index) => (
          <View key={`week-${index}`} style={styles.weekRow}>
            {week.map((cell) => {
              const isToday = isSameDay(cell.date, today);
              const isSelected = isSameDay(cell.date, selectedDate ?? new Date(-1, -1, -1));
              const events =
                (cell.date && eventsByDate[formatDateKey(cell.date)]) || [];

              const badgeStyles = [
                styles.dayBadge,
                isToday && styles.todayBadge,
                !isToday && isSelected && styles.selectedBadge,
              ];

              const textStyles = [
                styles.dayText,
                isToday && styles.todayText,
                !isToday && isSelected && styles.selectedText,
              ];

              return (
                <TouchableOpacity
                  key={cell.key}
                  style={styles.dayCell}
                  activeOpacity={cell.date ? 0.6 : 1}
                  onPress={() => {
                    if (cell.date) {
                      setSelectedDate(cell.date);
                    }
                  }}
                >
                  {cell.date ? (
                    <>
                      <View style={badgeStyles}>
                        <Text style={textStyles}>{cell.date.getDate()}</Text>
                      </View>
                      {events.length > 0 && <View style={styles.eventDot} />}
                    </>
                  ) : null}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

      <View style={styles.eventListSection}>
        <Text style={styles.eventListTitle}>
          {selectedDate
            ? `${selectedDate.getMonth() + 1}월 ${selectedDate.getDate()}일 일정`
            : "날짜를 선택해 주세요"}
        </Text>
        <ScrollView
          style={styles.eventList}
          contentContainerStyle={styles.eventListContent}
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
        >
          {loadingEvents ? (
            <Text style={styles.eventListEmpty}>일정을 불러오는 중...</Text>
          ) : eventsError ? (
            <Text style={styles.eventListEmpty}>{eventsError}</Text>
          ) : selectedDate &&
            eventsByDate[formatDateKey(selectedDate)] &&
            eventsByDate[formatDateKey(selectedDate)].length > 0 ? (
            eventsByDate[formatDateKey(selectedDate)].map((event) => (
              <View key={event.id} style={styles.eventListItem}>
                <View style={styles.eventListDot} />
                <Text style={styles.eventListText}>{event.title}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.eventListEmpty}>등록된 일정이 없습니다.</Text>
          )}
        </ScrollView>
      </View>

      <Modal visible={isModalVisible} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedDate ? `${formatMonthYear(selectedDate)} ${selectedDate.getDate()}일` : ""}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="일정 제목"
              value={newEventTitle}
              onChangeText={setNewEventTitle}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setIsModalVisible(false);
                  setNewEventTitle("");
                }}
              >
                <Text style={styles.modalButtonText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={() => {
                  if (!selectedDate) {
                    Alert.alert("날짜 선택", "일정을 추가할 날짜를 선택해 주세요.");
                    return;
                  }
                  if (!newEventTitle.trim()) {
                    Alert.alert("입력 필요", "일정 제목을 입력해 주세요.");
                    return;
                  }
                  const key = formatDateKey(selectedDate);
                  const title = newEventTitle.trim();

                  addDoc(collection(db, "events"), { date: key, title })
                    .then((docRef) => {
                      setEventsByDate((prev) => {
                        const prevEvents = prev[key] ?? [];
                        const color =
                          EVENT_COLORS[prevEvents.length % EVENT_COLORS.length];
                        const newEvent: CalendarEventDisplay = {
                          id: docRef.id,
                          title,
                          color,
                        };
                        return {
                          ...prev,
                          [key]: [...prevEvents, newEvent],
                        };
                      });
                      setNewEventTitle("");
                      setIsModalVisible(false);
                    })
                    .catch((error) => {
                      console.error(error);
                      Alert.alert("오류", "일정을 저장하지 못했습니다. 다시 시도해 주세요.");
                    });
                }}
              >
                <Text style={[styles.modalButtonText, styles.confirmButtonText]}>추가</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
  },
  addButton: {
    backgroundColor: "#111827",
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: {
    fontSize: 24,
    color: "#FFFFFF",
    marginTop: -4,
  },
  monthSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  arrowText: {
    fontSize: 20,
    color: "#6B7280",
  },
  monthText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
  },
  calendar: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 8,
  },
  dayLabel: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  sundayLabel: {
    color: "#F87171",
  },
  dayCell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 45,
    position: "relative",
  },
  dayBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  todayBadge: {
    backgroundColor: "#4F46E5",
  },
  selectedBadge: {
    backgroundColor: "#E0E7FF",
    borderWidth: 1,
    borderColor: "#4338CA",
  },
  dayText: {
    fontSize: 15,
    color: "#111827",
    fontWeight: "600",
  },
  todayText: {
    color: "#FFFFFF",
  },
  selectedText: {
    color: "#4338CA",
    fontWeight: "700",
  },
  eventDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#2563EB",
    position: "absolute",
    bottom: 6,
  },
  eventListSection: {
    marginTop: 12,
    paddingVertical: 8,
  },
  eventListTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  eventList: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    maxHeight: 240,
  },
  eventListContent: {
    paddingBottom: 8,
  },
  eventListItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  eventListDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
    backgroundColor: "#2563EB",
  },
  eventListText: {
    fontSize: 14,
    color: "#1F2937",
  },
  eventListEmpty: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#111827",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
    fontSize: 15,
    color: "#111827",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  modalButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: "#E5E7EB",
  },
  confirmButton: {
    backgroundColor: "#111827",
  },
  modalButtonText: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "600",
  },
  confirmButtonText: {
    color: "#FFFFFF",
  },
});