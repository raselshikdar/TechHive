-- Insert default categories (based on TrickBD)
INSERT INTO categories (name, slug, description, icon, color) VALUES
  ('Trickbd Notice', 'trickbd-notice', 'Official notices and important information', '📢', '#ef4444'),
  ('Web Development', 'web-development', 'Web development tutorials and resources', '💻', '#3b82f6'),
  ('Linux', 'linux', 'Linux tips, tricks and tutorials', '🐧', '#22c55e'),
  ('Tech News', 'tech-news', 'Latest technology news and updates', '📰', '#f59e0b'),
  ('Windows PC', 'windows-pc', 'Windows tips and PC tutorials', '🪟', '#0ea5e9'),
  ('Apps review', 'apps-review', 'Mobile and desktop app reviews', '📱', '#8b5cf6'),
  ('LifeStyle', 'lifestyle', 'Lifestyle and general topics', '🌟', '#ec4899'),
  ('Blogger', 'blogger', 'Blogger platform tutorials', '✍️', '#06b6d4'),
  ('JavaScript', 'javascript', 'JavaScript programming tutorials', '⚡', '#eab308'),
  ('Tools', 'tools', 'Useful tools and utilities', '🔧', '#10b981'),
  ('Operating system', 'operating-system', 'Operating systems information', '🖥️', '#6366f1'),
  ('Mobile Banking', 'mobile-banking', 'Mobile banking guides and tips', '💳', '#14b8a6'),
  ('Android Custom Rom', 'android-custom-rom', 'Android custom ROM guides', '🤖', '#f97316'),
  ('Java programming', 'java-programming', 'Java programming tutorials', '☕', '#dc2626'),
  ('Wapka', 'wapka', 'Wapka platform tutorials', '🌐', '#a855f7'),
  ('Java mobile', 'java-mobile', 'Java mobile development', '📲', '#84cc16'),
  ('Uncategorized', 'uncategorized', 'Other topics', '📂', '#64748b')
ON CONFLICT (slug) DO NOTHING;

COMMIT;
