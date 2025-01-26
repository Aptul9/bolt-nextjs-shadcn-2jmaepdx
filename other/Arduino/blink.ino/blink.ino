void setup() {
  // Initialize digital pin 13 as an output.
  pinMode(13, OUTPUT);
}

void loop() {
  // Turn the LED on (HIGH is the voltage level)
  digitalWrite(13, HIGH);
  delay(1000); // Wait for 1 second (1000 milliseconds)

  // Turn the LED off by making the voltage LOW
  digitalWrite(13, LOW);
  delay(1000); // Wait for 1 second
}
