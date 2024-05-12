#include <SPI.h>
#include <MFRC522.h>

#define SS_PIN 10 // RX slave select
#define RST_PIN 9

MFRC522 mfrc522(SS_PIN, RST_PIN); // Create MFRC522 instance.

byte card_ID[9];                          // card UID size 4byte
byte Name1[9] = {0x3C, 0x4A, 0xDA, 0xCC}; // first UID card
byte Name2[9] = {0xB3, 0x99, 0x25, 0x0E}; // second UID card
byte Name3[9] = {0x4C, 0x88, 0x0F, 0x33}; // third UID card
byte Name4[9] = {0xF3, 0xEE, 0x88, 0x90}; // fouth UID crad

// if you want the arduino to detect the cards only once
int NumbCard[9]; // this array content the number of cards. in my case i have just two cards.
int j = 0;

int const RedLed = 6;
int const GreenLed = 5;
int const Buzzer = 8;

String Name; // user name
long Roll;   // user Roll no.
int n;       // The number of card you want to detect (optional)

void setup()
{
  Serial.begin(9600); // Initialize serial communications with the PC
  SPI.begin();        // Init SPI bus
  mfrc522.PCD_Init(); // Init MFRC522 card

  Serial.println("CLEARSHEET");                    // clears starting at row 1
  Serial.println("LABEL,Date,Time,Name,Roll no."); // make four columns (Date,Time,[Name:"user name"]line 48 & 52,[Roll no.:"user Roll no."]line 49 & 53)

  pinMode(RedLed, OUTPUT);
  pinMode(GreenLed, OUTPUT);
  pinMode(Buzzer, OUTPUT);
}

void loop()
{
  // look for new card
  if (!mfrc522.PICC_IsNewCardPresent())
  {
    return; // got to start of loop if there is no card present
  }
  // Select one of the cards
  if (!mfrc522.PICC_ReadCardSerial())
  {
    return; // if read card serial(0) returns 1, the uid struct contians the ID of the read card.
  }

  for (byte i = 0; i < mfrc522.uid.size; i++)
  {
    card_ID[i] = mfrc522.uid.uidByte[i];

    if (card_ID[i] == Name1[i])
    {
      Name = "PRERONA SAHA";  // user name
      Roll = "CHP/21/EL/023"; // user Roll no.
      j = 0;                  // first number in the NumbCard array : NumbCard[j]
    }
    else if (card_ID[i] == Name2[i])
    {
      Name = "GAUTAM RAY"; // user name
      Roll = "030";        // user Roll no "030".
      j = 1;               // Second number in the NumbCard array : NumbCard[j]
    }
    else if (card_ID[i] == Name3[i])
    {
      Name = "HASEN ALI";     // user name
      Roll = "CHP/21/EL/025"; // user Roll no.
      j = 2;                  // third number in the NumbCard array : NumbCard[j]
    }
    else if (card_ID[i] == Name4[i])
    {
      Name = "EAKUB ALI";     // user name
      Roll = "CHP/21/EL/008"; // user Roll no.
      j = 3;                  // fourth number in the NumbCard array : NumbCard[j]
    }
    else
    {
      digitalWrite(GreenLed, LOW);
      digitalWrite(RedLed, HIGH);
      goto cont; // go directly to line 85
    }
  }
  if (NumbCard[j] == 1)
  { // to check if the card already detect
    // if you want to use LCD
    // Serial.println("Already Exist");
  }
  else
  {
    NumbCard[j] = 1;                        // put 1 in the NumbCard array : NumbCard[j]={1,1} to let the arduino know if the card was detecting
    n++;                                    //(optional)
    Serial.print("DATA,DATE,TIME," + Name); // send the Name to excel
    Serial.print(",");
    Serial.println(Roll); // send the Number to excel
    digitalWrite(GreenLed, HIGH);
    digitalWrite(RedLed, LOW);
    digitalWrite(Buzzer, HIGH);
    delay(30);
    digitalWrite(Buzzer, LOW);
    Serial.println("SAVEWORKBOOKAS,Names/WorkNames");
  }
  delay(60);
cont:
  delay(60);
  digitalWrite(GreenLed, LOW);
  digitalWrite(RedLed, LOW);

  // if you want to close the Excel when all card had detected and save Excel file in Names Folder. in my case i have just 2 card (optional)
  // if(n==4){

  //  Serial.println("FORCEEXCELQUIT");
    //   }
}