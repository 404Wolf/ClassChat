import { useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

const CLASS_ID_KEY = "classid";
const classIDSchema = z.string().uuid();

interface UseClassIdReturn {
  classId: string | null;
  resetClassId: () => void;
}

export function useClassId(): UseClassIdReturn {
  const [classId, setClassId] = useState<string | null>(null);

  // Function to reset and store a new classId
  const resetClassId = useCallback(() => {
    const newClassId = uuidv4();
    localStorage.setItem(CLASS_ID_KEY, newClassId);
    setClassId(newClassId);
  }, []);

  // Initialize classId on mount
  useEffect(() => {
    let storedClassId = localStorage.getItem(CLASS_ID_KEY);
    if (!storedClassId || !classIDSchema.safeParse(storedClassId).success) {
      storedClassId = uuidv4();
      localStorage.setItem(CLASS_ID_KEY, storedClassId);
    }
    setClassId(storedClassId);
  }, []);

  return { classId, resetClassId };
}
