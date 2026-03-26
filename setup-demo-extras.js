require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE env vars.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupExtras() {
  console.log("Signing in as demo user...");
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'demo@cashmind.app',
    password: 'demoPassword123!'
  });

  if (authError || !authData.user) {
    console.error("Failed to sign in:", authError);
    return;
  }

  const userId = authData.user.id;
  console.log("Logged in as ID:", userId);
  
  const now = new Date();
  const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  // 1. Budget
  console.log("Setting up Budgets...");
  await supabase.from('budgets').delete().eq('user_id', userId);
  await supabase.from('budgets').insert([
    { user_id: userId, category: 'Food & Drinks', limit: 3000000, month_year: monthKey },
    { user_id: userId, category: 'Transport', limit: 1000000, month_year: monthKey },
    { user_id: userId, category: 'Entertainment', limit: 500000, month_year: monthKey },
    { user_id: userId, category: 'Shopping', limit: 1500000, month_year: monthKey },
    { user_id: userId, category: 'Home & Bills', limit: 2000000, month_year: monthKey },
  ]);

  // 1.1 Transactions
  console.log("Setting up Transactions...");
  await supabase.from('transactions').delete().eq('user_id', userId);
  await supabase.from('transactions').insert([
    { user_id: userId, description: 'Gaji Bulanan', amount: 15000000, category: 'Salary', type: 'income', status: 'success', date: now.toISOString().split('T')[0] },
    { user_id: userId, description: 'Makan Siang Bakso', amount: 35000, category: 'Food & Drinks', type: 'expense', status: 'success', date: new Date(now.getTime() - 1*24*60*60*1000).toISOString().split('T')[0] },
    { user_id: userId, description: 'Bensin Motor', amount: 50000, category: 'Transport', type: 'expense', status: 'success', date: new Date(now.getTime() - 1*24*60*60*1000).toISOString().split('T')[0] },
    { user_id: userId, description: 'Belanja Mingguan', amount: 450000, category: 'Food & Drinks', type: 'expense', status: 'success', date: new Date(now.getTime() - 2*24*60*60*1000).toISOString().split('T')[0] },
    { user_id: userId, description: 'Tiket Bioskop', amount: 100000, category: 'Entertainment', type: 'expense', status: 'success', date: new Date(now.getTime() - 3*24*60*60*1000).toISOString().split('T')[0] },
    { user_id: userId, description: 'Bayar Listrik', amount: 350000, category: 'Home & Bills', type: 'expense', status: 'success', date: new Date(now.getTime() - 4*24*60*60*1000).toISOString().split('T')[0] },
    { user_id: userId, description: 'Bonus Project', amount: 2500000, category: 'Bonus', type: 'income', status: 'success', date: new Date(now.getTime() - 5*24*60*60*1000).toISOString().split('T')[0] },
    { user_id: userId, description: 'Kopi Kenangan', amount: 25000, category: 'Food & Drinks', type: 'expense', status: 'success', date: now.toISOString().split('T')[0] },
    { user_id: userId, description: 'Topup OVO', amount: 200000, category: 'Others', type: 'expense', status: 'success', date: now.toISOString().split('T')[0] },
  ]);

  // 2. Subscriptions
  console.log("Setting up Subscriptions...");
  await supabase.from('subscriptions').delete().eq('user_id', userId);
  
  const in2Days = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const in5Days = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  await supabase.from('subscriptions').insert([
    { user_id: userId, name: 'Netflix', price: 153000, billing: 'Monthly', next_date: in2Days, icon: 'film', bg_color: 'bg-red-500' },
    { user_id: userId, name: 'Spotify Premium', price: 54000, billing: 'Monthly', next_date: in5Days, icon: 'music', bg_color: 'bg-green-500' },
    { user_id: userId, name: 'Gym Membership', price: 350000, billing: 'Monthly', next_date: new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString().split('T')[0], icon: 'activity', bg_color: 'bg-blue-500' }
  ]);

  // 3. Goals / Sorotan Target
  console.log("Cleaning up Goals (as requested)...");
  await supabase.from('goals').delete().eq('user_id', userId);
  // Disabled as per user request to remove dummy sorotan target
  /*
  await supabase.from('goals').insert([
    { user_id: userId, title: 'Dana Darurat', target_amount: 50000000, current_amount: 15000000, color: 'bg-purple-600' },
    { user_id: userId, title: 'Liburan Jepang', target_amount: 25000000, current_amount: 5000000, color: 'bg-blue-600' },
    { user_id: userId, title: 'Beli MacBook', target_amount: 20000000, current_amount: 18000000, color: 'bg-emerald-600' }
  ]);
  */

  // 4. Achievement / Badges
  console.log("Setting up Badges...");
  await supabase.from('user_badges').delete().eq('user_id', userId);
  await supabase.from('user_badges').insert([
    { user_id: userId, badge_key: 'first_budget', name: 'Master Budgeter', description: 'Membuat dan mematuhi budget selama 1 bulan.', icon: '💰' },
    { user_id: userId, badge_key: 'saver_streak', name: 'Consistent Saver', description: 'Menyisihkan 20% penghasilan secara konsisten.', icon: '🔥' },
    { user_id: userId, badge_key: 'explorer', name: 'Financial Explorer', description: 'Mencoba semua fitur unggulan CashMind.', icon: '🏆' }
  ]);

  // 5. Financial Circle
  console.log("Setting up Finance Circle...");
  await supabase.from('circle_members').delete().eq('user_id', userId);
  await supabase.from('finance_circles').delete().eq('created_by', userId);
  
  const { data: circleData } = await supabase.from('finance_circles').insert([
    { created_by: userId, name: 'Keluarga Cemara', emoji: '🏡', invite_code: 'CEMARA2024', monthly_budget: 10000000 }
  ]).select().single();

  if (circleData) {
    await supabase.from('circle_members').insert([
      { circle_id: circleData.id, user_id: userId, role: 'owner' }
    ]);
    
    await supabase.from('circle_expenses').delete().eq('circle_id', circleData.id);
    await supabase.from('circle_expenses').insert([
      { circle_id: circleData.id, user_id: userId, description: 'Belanja Bulanan', amount: 1500000, category: 'Food' },
      { circle_id: circleData.id, user_id: userId, description: 'Bayar Listrik', amount: 800000, category: 'Bills' },
    ]);
  }

  // 6. User Challenges
  console.log("Setting up active challenges...");
  await supabase.from('user_challenges').delete().eq('user_id', userId);
  const { data: templates } = await supabase.from('challenge_templates').select('id, xp_reward, title').limit(3);
  
  if (templates && templates.length > 0) {
    await supabase.from('user_challenges').insert([
      { user_id: userId, template_id: templates[0].id, status: 'active', spent: 0, ends_at: new Date(now.getTime() + 7*24*60*60*1000).toISOString() },
      ...(templates.length > 1 ? [{ user_id: userId, template_id: templates[1].id, status: 'completed', xp_earned: 5000, spent: 0, ends_at: new Date(now.getTime() - 2*24*60*60*1000).toISOString() }] : []),
      ...(templates.length > 2 ? [{ user_id: userId, template_id: templates[2].id, status: 'completed', xp_earned: 2500, spent: 0, ends_at: new Date(now.getTime() - 10*24*60*60*1000).toISOString() }] : [])
    ]);
  } else {
    // Insert dummy templates
    const { data: newTemp1 } = await supabase.from('challenge_templates').insert([
      { title: 'No Coffee Week', difficulty: 'EASY', xp_reward: 100, category: 'Food & Dining', limit_amount: 0, duration_days: 7, description: 'Jangan beli kopi di luar selama seminggu!' }
    ]).select().single();
    const { data: newTemp2 } = await supabase.from('challenge_templates').insert([
      { title: 'Master of Frugality', difficulty: 'HARD', xp_reward: 5000, category: 'Shopping', limit_amount: 100000, duration_days: 30, description: 'Selesaikan tantangan paling berat bulan ini.' }
    ]).select().single();
    
    if (newTemp1 && newTemp2) {
      await supabase.from('user_challenges').insert([
        { user_id: userId, template_id: newTemp1.id, status: 'active', spent: 0, ends_at: new Date(now.getTime() + 7*24*60*60*1000).toISOString() },
        { user_id: userId, template_id: newTemp2.id, status: 'completed', xp_earned: 5000, spent: 0, ends_at: new Date(now.getTime() - 2*24*60*60*1000).toISOString() }
      ]);
    }
  }

  console.log("Done adding extra dummy data!");
}

setupExtras().catch(console.error);
