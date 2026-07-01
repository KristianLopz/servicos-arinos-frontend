USE travelbuddy;

DELETE i1
FROM itineraries i1
JOIN itineraries i2
  ON i1.user_id = i2.user_id
  AND i1.destination_id = i2.destination_id
  AND i1.duration_days = i2.duration_days
  AND COALESCE(i1.num_people, 1) = COALESCE(i2.num_people, 1)
  AND i1.id < i2.id;
