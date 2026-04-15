package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Resume struct {
	Personal   Personal          `json:"personal" bson:"personal"`
	Summary    string            `json:"summary" bson:"summary"`
	Skills     map[string]string `json:"skills" bson:"skills"`
	Experience []Experience      `json:"experience" bson:"experience"`
	Projects   []Project         `json:"projects" bson:"projects"`
	Education  Education         `json:"education" bson:"education"`
}

type Personal struct {
	Name     string `json:"name" bson:"name"`
	Title    string `json:"title" bson:"title"`
	Location string `json:"location" bson:"location"`
	Email    string `json:"email" bson:"email"`
	Phone    string `json:"phone" bson:"phone"`
	Linkedin string `json:"linkedin" bson:"linkedin"`
	Github   string `json:"github" bson:"github"`
}

type Experience struct {
	ID        string   `json:"id" bson:"id"`
	Company   string   `json:"company" bson:"company"`
	Role      string   `json:"role" bson:"role"`
	StartDate string   `json:"startDate" bson:"startDate"`
	EndDate   string   `json:"endDate" bson:"endDate"`
	Current   bool     `json:"current" bson:"current"`
	Bullets   []string `json:"bullets" bson:"bullets"`
}

type Project struct {
	ID      string   `json:"id" bson:"id"`
	Name    string   `json:"name" bson:"name"`
	Tech    string   `json:"tech" bson:"tech"`
	Live    string   `json:"live" bson:"live"`
	Code    string   `json:"code" bson:"code"`
	Bullets []string `json:"bullets" bson:"bullets"`
}

type Education struct {
	Degree     string `json:"degree" bson:"degree"`
	University string `json:"university" bson:"university"`
	Year       string `json:"year" bson:"year"`
	CGPA       string `json:"cgpa" bson:"cgpa"`
}

var collection *mongo.Collection

func main() {
	godotenv.Load()
	uri := os.Getenv("MONGO_URI")
	if uri == "" {
		log.Fatal("MONGO_URI is missing")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))
	if err != nil {
		log.Fatal(err)
	}
	defer client.Disconnect(ctx)

	collection = client.Database("portfolio_cms").Collection("resume")
	count, _ := collection.CountDocuments(ctx, bson.M{})
	if count == 0 {
		seedDatabase()
	}

	http.HandleFunc("/api/resume", resumeHandler)
	http.HandleFunc("/api/login", loginHandler)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	fmt.Printf("🚀 Server running on port %s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}

func seedDatabase() {
	data, err := os.ReadFile("../frontend/resume.json")
	if err != nil {
		log.Println("Seed skipped")
		return
	}
	var resume Resume
	json.Unmarshal(data, &resume)
	collection.InsertOne(context.Background(), resume)
}

func loginHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "https://chitrang-chauhan.vercel.app")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if r.Method == http.MethodOptions {
		return
	}
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var creds struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}
	json.NewDecoder(r.Body).Decode(&creds)

	if creds.Username == os.Getenv("ADMIN_USER") && creds.Password == os.Getenv("ADMIN_PASS") {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"token": "admin-authenticated"})
		return
	}
	http.Error(w, "Unauthorized", http.StatusUnauthorized)
}

func resumeHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "https://chitrang-chauhan.vercel.app")
	w.Header().Set("Access-Control-Allow-Methods", "GET, PUT, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

	if r.Method == http.MethodOptions {
		return
	}

	if r.Method == http.MethodGet {
		var resume Resume
		err := collection.FindOne(context.Background(), bson.M{}).Decode(&resume)
		if err != nil {
			http.Error(w, "Error fetching data", http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(resume)
		return
	}

	if r.Method == http.MethodPut {
		auth := r.Header.Get("Authorization")
		if auth != "Bearer admin-authenticated" {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		var updated Resume
		if err := json.NewDecoder(r.Body).Decode(&updated); err != nil {
			http.Error(w, "Invalid input", http.StatusBadRequest)
			return
		}

		_, err := collection.ReplaceOne(context.Background(), bson.M{}, updated)
		if err != nil {
			http.Error(w, "Update failed", http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
	}
}