const express = require("express");
const Pet = require("../models/pets");
const User = require("../models/userModel");

const FakePetRouter = express.Router();

FakePetRouter.post("/generate-fake-pets", async (req, res) => {
    try {
        // Lấy danh sách tất cả người dùng có role là "user"
        const users = await User.find({ role: "user" });

        const petTypes = [
            { 
                type: "Dog", 
                breeds: ["Pomeranian", "Bulldog", "Labrador", "Golden Retriever", "Beagle"],
                names: ["Buddy", "Charlie", "Max", "Bella", "Lucy", "Daisy", "Milo", "Rocky"]
            },
            { 
                type: "Cat", 
                breeds: ["Persian", "Siamese", "Russian Blue", "Maine Coon", "Bengal"],
                names: ["Luna", "Oliver", "Leo", "Milo", "Simba", "Chloe", "Nala", "Cleo"]
            },
            { 
                type: "Bunny", 
                breeds: ["Holland Lop", "Netherland Dwarf", "Lionhead", "Flemish Giant"],
                names: ["Thumper", "Coco", "Oreo", "Snowball", "Bunbun", "Fluffy", "Daisy", "Lola"]
            },
            { 
                type: "Bird", 
                breeds: ["Parrot", "Canary", "Cockatiel", "Budgerigar"],
                names: ["Tweety", "Sunny", "Sky", "Kiwi", "Coco", "Buddy", "Angel", "Rio"]
            },
        ];

        const genders = ["Male", "Female"];
        const pets = [];

        for (const user of users) {
            // Random số lượng pet cho mỗi user (1-3 pets)
            const petCount = Math.floor(Math.random() * 3) + 1;

            for (let i = 0; i < petCount; i++) {
                const randomType = petTypes[Math.floor(Math.random() * petTypes.length)];
                const randomBreed = randomType.breeds[Math.floor(Math.random() * randomType.breeds.length)];
                const randomGender = genders[Math.floor(Math.random() * genders.length)];
                const randomName = randomType.names[Math.floor(Math.random() * randomType.names.length)];

                const newPet = new Pet({
                    PetName: randomName,
                    BirthDate: new Date(Date.now() - Math.floor(Math.random() * 5 * 365 * 24 * 60 * 60 * 1000)), // Random từ 0-5 năm trước
                    PetImageLoc: "/images/default-pet.png",
                    Gender: randomGender,
                    TypeOfPet: randomType.type,
                    Breed: randomBreed,
                    VetVisits: generateRandomVetVisits(),
                    Medications: generateRandomMedications(),
                    Reminders: generateRandomReminders(),
                    ParentID: user._id,
                });

                pets.push(newPet);
            }
        }

        // Lưu tất cả các pet mới vào cơ sở dữ liệu
        if (pets.length > 0) {
            await Pet.insertMany(pets);
        }

        res.status(201).json({ msg: `${pets.length} pets created for users.` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Error generating fake pets" });
    }
});

// Hàm tạo dữ liệu VetVisits ngẫu nhiên
const generateRandomVetVisits = () => {
    const visitCount = Math.floor(Math.random() * 3); // Random từ 0-2 visits
    const visits = [];
    for (let i = 0; i < visitCount; i++) {
        visits.push({
            VisitDate: new Date(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000)), // Random từ 0-365 ngày trước
            VisitNotes: ["Routine checkup", "Vaccination", "Follow-up visit", "Emergency visit"][Math.floor(Math.random() * 4)],
            Weight: Math.floor(Math.random() * 30) + 5, // Random từ 5-35 kg
        });
    }
    return visits;
};

// Hàm tạo dữ liệu Medications ngẫu nhiên
const generateRandomMedications = () => {
    const medCount = Math.floor(Math.random() * 2); // Random từ 0-1 medications
    const medications = [];
    for (let i = 0; i < medCount; i++) {
        medications.push({
            MedicationName: ["Vitamin Supplement", "Antibiotics", "Pain Relief", "Deworming"][Math.floor(Math.random() * 4)],
            DueDate: new Date(Date.now() + Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)), // Random từ 0-30 ngày tới
            Dose: ["1 tablet daily", "2 tablets daily", "5ml twice a day", "10ml once a day"][Math.floor(Math.random() * 4)],
        });
    }
    return medications;
};

// Hàm tạo dữ liệu Reminders ngẫu nhiên
const generateRandomReminders = () => {
    const reminderCount = Math.floor(Math.random() * 2); // Random từ 0-1 reminders
    const reminders = [];
    for (let i = 0; i < reminderCount; i++) {
        reminders.push({
            Date: new Date(Date.now() + Math.floor(Math.random() * 15 * 24 * 60 * 60 * 1000)), // Random từ 0-15 ngày tới
            Title: ["Vaccination Reminder", "Deworming Reminder", "Health Check Reminder"][Math.floor(Math.random() * 3)],
            Note: ["Don't forget to vaccinate your pet.", "Time for deworming.", "Schedule a health check for your pet."][Math.floor(Math.random() * 3)],
        });
    }
    return reminders;
};

module.exports = {FakePetRouter};