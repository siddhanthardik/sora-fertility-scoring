const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabase = createClient(
  'https://crxwaihhwcqgxarikyyw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNyeHdhaWhod2NxZ3hhcmlreXl3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTM0MjA3MiwiZXhwIjoyMDk0OTE4MDcyfQ.TjtnkvX6KA8LF6_0Q7cZPDMzxuhFCrkEgqevp7mBD-I'
);

async function run() {
  try {
    const hash = await bcrypt.hash('sora123!', 10);
    const { data, error } = await supabase
      .from('clinic_registry')
      .update({ password_hash: hash })
      .is('password_hash', null)
      .select();
    
    console.log('Updated passwords for:', data?.length || 0, 'clinics');
    if (error) console.error(error);
  } catch (err) {
    console.error(err);
  }
}

run();
