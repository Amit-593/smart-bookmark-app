const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://vwidrleaipiupldfrwra.supabase.co'
const supabaseKey = 'sb_publishable_5sSGVgYo1cRA3O8rO7bkrw_44e49rH8'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log('Testing Supabase connection...')
  try {
    const { data, error } = await supabase.from('bookmarks').select('*').limit(1)
    if (error) {
      console.error('Connection failed:', error)
    } else {
      console.log('Connection successful!')
      console.log('Data:', data)
    }
  } catch (err) {
    console.error('Unexpected error:', err)
  }
}

testConnection()
