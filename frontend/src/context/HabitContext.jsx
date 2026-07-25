import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { habitService } from '../services/habitService';
import { analyticsService } from '../services/analyticsService';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

const HabitContext = createContext();

export const HabitProvider = ({ children }) => {
  const { user, refreshUser } = useAuth();
  const [habits, setHabits] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  const fetchHabits = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await habitService.getHabits({
        category: selectedCategory,
        priority: selectedPriority,
        isArchived: showArchived,
        search: searchQuery,
      });
      setHabits(data.habits);

      const summaryData = await analyticsService.getSummary();
      setSummary(summaryData.summary);
    } catch (error) {
      console.error('Error fetching habits:', error);
    } finally {
      setLoading(false);
    }
  }, [user, selectedCategory, selectedPriority, showArchived, searchQuery]);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  // Trigger celebratory confetti effect
  const triggerConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
    });
  };

  const createHabit = async (habitData) => {
    try {
      const data = await habitService.createHabit(habitData);
      toast.success('Habit created successfully! ⚡');
      await fetchHabits();
      return data.habit;
    } catch (error) {
      toast.error(error.message || 'Failed to create habit');
    }
  };

  const updateHabit = async (id, habitData) => {
    try {
      const data = await habitService.updateHabit(id, habitData);
      toast.success('Habit updated!');
      await fetchHabits();
      return data.habit;
    } catch (error) {
      toast.error(error.message || 'Failed to update habit');
    }
  };

  const deleteHabit = async (id) => {
    try {
      await habitService.deleteHabit(id);
      toast.success('Habit deleted');
      await fetchHabits();
    } catch (error) {
      toast.error(error.message || 'Failed to delete habit');
    }
  };

  const toggleArchiveHabit = async (id) => {
    try {
      const data = await habitService.toggleArchiveHabit(id);
      toast.success(data.message);
      await fetchHabits();
    } catch (error) {
      toast.error(error.message || 'Failed to archive habit');
    }
  };

  const toggleHabitStatus = async (id, date, status = 'completed') => {
    try {
      const data = await habitService.toggleHabitStatus(id, date, status);
      await fetchHabits();
      await refreshUser();

      if (data.xpResult) {
        toast.success(`+${data.xpResult.xpEarned || 15} XP Earned! 🌟`, {
          icon: '⚡',
        });

        if (data.xpResult.levelUp) {
          toast.success(`🎉 Level Up! You are now Level ${data.xpResult.level}!`, {
            duration: 5000,
          });
          triggerConfetti();
        }

        if (data.xpResult.newBadges && data.xpResult.newBadges.length > 0) {
          data.xpResult.newBadges.forEach((b) => {
            toast.success(`🏆 Badge Unlocked: ${b.title}!`, { duration: 6000 });
          });
          triggerConfetti();
        }
      }

      // Check if all today habits are now completed
      const todayStr = new Date().toISOString().split('T')[0];
      const activeHabits = habits.filter((h) => !h.isArchived);
      const allCompleted = activeHabits.length > 0 && activeHabits.every((h) => {
        if (h._id === id) return status === 'completed';
        return h.completedDates.some((d) => d.date === todayStr && d.status === 'completed');
      });

      if (allCompleted && status === 'completed') {
        triggerConfetti();
        toast.success('🎉 Amazing! All habits completed for today!', { duration: 5000 });
      }
    } catch (error) {
      toast.error(error.message || 'Failed to update habit status');
    }
  };

  return (
    <HabitContext.Provider
      value={{
        habits,
        summary,
        loading,
        selectedCategory,
        setSelectedCategory,
        selectedPriority,
        setSelectedPriority,
        searchQuery,
        setSearchQuery,
        showArchived,
        setShowArchived,
        fetchHabits,
        createHabit,
        updateHabit,
        deleteHabit,
        toggleArchiveHabit,
        toggleHabitStatus,
        triggerConfetti,
      }}
    >
      {children}
    </HabitContext.Provider>
  );
};

export const useHabits = () => useContext(HabitContext);
