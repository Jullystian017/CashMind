-- Challenges System: templates, user_challenges, user_badges

-- Challenge Templates (predefined, available to all users)
CREATE TABLE public.challenge_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  difficulty text NOT NULL CHECK (difficulty IN ('EASY', 'MEDIUM', 'HARD')),
  xp_reward int NOT NULL DEFAULT 50,
  category text NOT NULL DEFAULT '',
  limit_amount bigint NOT NULL DEFAULT 0,
  duration_days int NOT NULL DEFAULT 7,
  description text NOT NULL DEFAULT '',
  is_recommended boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- No RLS on templates (public read)
ALTER TABLE public.challenge_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read challenge templates"
  ON public.challenge_templates FOR SELECT
  USING (true);

-- Seed default templates
INSERT INTO public.challenge_templates (title, difficulty, xp_reward, category, limit_amount, duration_days, description, is_recommended) VALUES
  ('Reduce Food Spending by 10%', 'EASY', 50, 'Food & Drinks', 315000, 7, 'Keep your food spending under Rp 315.000 for 7 days.', false),
  ('Reduce Food Spending by 20%', 'MEDIUM', 120, 'Food & Drinks', 280000, 7, 'Keep your food spending under Rp 280.000 for 7 days.', true),
  ('No Eating Out for 7 Days', 'HARD', 300, 'Food & Drinks', 0, 7, 'Avoid all restaurant and takeaway spending for a full week.', false),
  ('Transport Budget Week', 'EASY', 50, 'Transport', 200000, 7, 'Keep transport costs under Rp 200.000 this week.', false),
  ('Shopping Freeze', 'MEDIUM', 120, 'Shopping', 0, 7, 'No shopping purchases for an entire week.', false),
  ('Entertainment Detox', 'EASY', 50, 'Entertainment', 100000, 7, 'Keep entertainment spending under Rp 100.000 for 7 days.', false);


-- User Challenges (per-user tracking)
CREATE TABLE public.user_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id uuid NOT NULL REFERENCES public.challenge_templates(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'failed', 'cancelled')),
  failure_reason text,
  xp_earned int NOT NULL DEFAULT 0,
  started_at timestamptz NOT NULL DEFAULT now(),
  ends_at timestamptz NOT NULL,
  spent bigint NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX user_challenges_user_id_idx ON public.user_challenges(user_id);
CREATE INDEX user_challenges_status_idx ON public.user_challenges(status);

-- Anti-duplicate: only one active challenge per template per user
CREATE UNIQUE INDEX user_challenges_active_unique
  ON public.user_challenges(user_id, template_id)
  WHERE status = 'active';

ALTER TABLE public.user_challenges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own challenges"
  ON public.user_challenges FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);


-- User Badges (auto-awarded)
CREATE TABLE public.user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_key text NOT NULL,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT '🏆',
  earned_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_key)
);

CREATE INDEX user_badges_user_id_idx ON public.user_badges(user_id);

ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own badges"
  ON public.user_badges FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
