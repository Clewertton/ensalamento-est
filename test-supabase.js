// Test script to check Supabase connection
import { supabase } from './lib/supabase.js';

async function testConnection() {
  console.log('Testing Supabase connection...');

  // Test 1: Get all rooms
  console.log('Fetching rooms...');
  const { data: rooms, error: roomsError } = await supabase
    .from('rooms')
    .select('*');

  if (roomsError) {
    console.error('Error fetching rooms:', roomsError);
  } else {
    console.log('Rooms:', rooms);
  }

  // Test 2: Try to insert a test room
  console.log('Inserting test room...');
  const testRoom = {
    name: 'Test Room',
    building: 'Test Building',
    capacity: 50
  };

  const { data: insertedRoom, error: insertError } = await supabase
    .from('rooms')
    .insert(testRoom)
    .select()
    .single();

  if (insertError) {
    console.error('Error inserting room:', insertError);
  } else {
    console.log('Inserted room:', insertedRoom);

    // Clean up: delete the test room
    if (insertedRoom?.id) {
      await supabase.from('rooms').delete().eq('id', insertedRoom.id);
      console.log('Test room cleaned up');
    }
  }
}

testConnection();