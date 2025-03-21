import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../lib/supabase';
import { query } from '../../lib/mssql';
import { Character, GameRanking, CharacterStats, ClassNames } from '../../types/game';
import { Shield, Swords, Trophy, Clock, Skull } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuthStore();
  const [character, setCharacter] = useState<Character | null>(null);
  const [stats, setStats] = useState<CharacterStats | null>(null);
  const [topPlayers, setTopPlayers] = useState<GameRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Get user's game character ID from profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('game_character_id')
          .eq('id', user?.id)
          .single();

        if (profile?.game_character_id) {
          // Load character data
          const [charData] = await query<Character>(
            'SELECT * FROM Characters WHERE CharID = @param0',
            [profile.game_character_id]
          );
          setCharacter(charData);

          // Load character stats
          const [statsData] = await query<CharacterStats>(
            'SELECT * FROM CharacterStats WHERE CharID = @param0',
            [profile.game_character_id]
          );
          setStats(statsData);
        }

        // Load top players
        const rankings = await query<GameRanking>(
          'SELECT TOP 5 * FROM Characters ORDER BY Level DESC, Exp DESC'
        );
        setTopPlayers(rankings);

      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/50 text-red-800 dark:text-red-200 p-4 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Character Overview */}
      {character && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Character Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <Shield className="h-6 w-6 text-primary-600 mb-2" />
              <div className="text-sm text-gray-500 dark:text-gray-400">Level</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {character.Level}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <Swords className="h-6 w-6 text-primary-600 mb-2" />
              <div className="text-sm text-gray-500 dark:text-gray-400">Class</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {ClassNames[character.Class]}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <Trophy className="h-6 w-6 text-primary-600 mb-2" />
              <div className="text-sm text-gray-500 dark:text-gray-400">Experience</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {character.Exp.toLocaleString()}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <Clock className="h-6 w-6 text-primary-600 mb-2" />
              <div className="text-sm text-gray-500 dark:text-gray-400">Last Login</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {new Date(character.LastLogin).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Character Stats */}
      {stats && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <Clock className="h-6 w-6 text-primary-600 mb-2" />
              <div className="text-sm text-gray-500 dark:text-gray-400">Play Time</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {Math.floor(stats.TotalPlayTime / 3600)}h
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <Swords className="h-6 w-6 text-primary-600 mb-2" />
              <div className="text-sm text-gray-500 dark:text-gray-400">Kills</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {stats.KillCount.toLocaleString()}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <Skull className="h-6 w-6 text-primary-600 mb-2" />
              <div className="text-sm text-gray-500 dark:text-gray-400">Deaths</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {stats.DeathCount.toLocaleString()}
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <Trophy className="h-6 w-6 text-primary-600 mb-2" />
              <div className="text-sm text-gray-500 dark:text-gray-400">Quests</div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {stats.QuestsCompleted.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Players */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Top Players
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Character
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Guild
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {topPlayers.map((player, index) => (
                <tr key={player.CharName}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    #{index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {player.CharName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {player.Level}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {ClassNames[player.Class]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {player.GuildName || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;