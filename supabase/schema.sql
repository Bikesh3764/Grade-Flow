-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES TABLE
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  name text,
  email text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table profiles enable row level security;
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- SEMESTERS TABLE
create table semesters (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  semester_number integer not null,
  sgpa numeric,
  credits numeric,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table semesters enable row level security;
create policy "Users can view own semesters" on semesters for select using (auth.uid() = user_id);
create policy "Users can insert own semesters" on semesters for insert with check (auth.uid() = user_id);
create policy "Users can update own semesters" on semesters for update using (auth.uid() = user_id);
create policy "Users can delete own semesters" on semesters for delete using (auth.uid() = user_id);

-- CGPA HISTORY TABLE
create table cgpa_history (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  timestamp timestamp with time zone default timezone('utc'::text, now()) not null,
  cgpa numeric not null,
  total_credits numeric not null
);

alter table cgpa_history enable row level security;
create policy "Users can view own cgpa history" on cgpa_history for select using (auth.uid() = user_id);
create policy "Users can insert own cgpa history" on cgpa_history for insert with check (auth.uid() = user_id);

-- SAVED RESULTS TABLE
create table saved_results (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  calculator_type text not null,
  input_data jsonb not null,
  result jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table saved_results enable row level security;
create policy "Users can view own saved results" on saved_results for select using (auth.uid() = user_id);
create policy "Users can insert own saved results" on saved_results for insert with check (auth.uid() = user_id);
create policy "Users can delete own saved results" on saved_results for delete using (auth.uid() = user_id);

-- REPORTS TABLE
create table reports (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  report_url text not null,
  generated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table reports enable row level security;
create policy "Users can view own reports" on reports for select using (auth.uid() = user_id);
create policy "Users can insert own reports" on reports for insert with check (auth.uid() = user_id);
create policy "Users can delete own reports" on reports for delete using (auth.uid() = user_id);

-- UNIVERSITY PREFERENCES TABLE
create table university_preferences (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  university_id text,
  regulation_id text,
  active_scale_id text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table university_preferences enable row level security;
create policy "Users can view own preferences" on university_preferences for select using (auth.uid() = user_id);
create policy "Users can insert own preferences" on university_preferences for insert with check (auth.uid() = user_id);
create policy "Users can update own preferences" on university_preferences for update using (auth.uid() = user_id);

-- Trigger to automatically create profile on signup
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  
  -- Create default university preferences for the new user
  insert into public.university_preferences (user_id, active_scale_id)
  values (new.id, 'standard-10');
  
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
