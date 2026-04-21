"use client";

import { useEffect, useState } from "react";

const DAILY_ENERGY = 30;
const ENERGY_PER_LESSON = 5;
const ENERGY_PER_QUIZ = 10;

interface EnergyData {
  remaining: number;
  max: number;
  lastReset: string;
}

export function useEnergy() {
  const [energy, setEnergy] = useState<EnergyData>({
    remaining: DAILY_ENERGY,
    max: DAILY_ENERGY,
    lastReset: new Date().toISOString().split("T")[0],
  });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Load energy from localStorage (client-side only)
    const stored = localStorage.getItem("userEnergy");
    if (stored) {
      const data = JSON.parse(stored);
      const today = new Date().toISOString().split("T")[0];

      // Reset if new day
      if (data.lastReset !== today) {
        const newData = {
          remaining: DAILY_ENERGY,
          max: DAILY_ENERGY,
          lastReset: today,
        };
        localStorage.setItem("userEnergy", JSON.stringify(newData));
        setEnergy(newData);
      } else {
        setEnergy(data);
      }
    } else {
      const today = new Date().toISOString().split("T")[0];
      const newData = {
        remaining: DAILY_ENERGY,
        max: DAILY_ENERGY,
        lastReset: today,
      };
      localStorage.setItem("userEnergy", JSON.stringify(newData));
      setEnergy(newData);
    }
  }, []);

  const useEnergyAmount = (amount: number = ENERGY_PER_LESSON) => {
    const newRemaining = Math.max(0, energy.remaining - amount);
    const newData = {
      ...energy,
      remaining: newRemaining,
    };
    setEnergy(newData);
    localStorage.setItem("userEnergy", JSON.stringify(newData));
    return newRemaining;
  };

  const hasEnough = (amount: number = ENERGY_PER_LESSON) => {
    return energy.remaining >= amount;
  };

  const isPremium = isMounted ? localStorage.getItem("isPremium") === "true" : false;

  return {
    energy: energy.remaining,
    maxEnergy: energy.max,
    useEnergy: useEnergyAmount,
    hasEnough,
    isPremium,
    isMounted,
  };
}