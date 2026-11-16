import tkinter as tk
from tkinter import ttk, messagebox
import json
import os
from datetime import datetime

DATA_FILE = "college_data.json"

DEFAULT_DATA = {
    "admin": {"password": "admin123"},
    "students": {
        "maria": {"name": "Maria Garcia", "program": "B.Tech", "password": "maria123", "cgpa": 9.2, "roll_no": "BTECH001", "semester": 2},
        "john": {"name": "John Doe", "program": "BCA", "password": "john123", "cgpa": 8.5, "roll_no": "BCA001", "semester": 3}
    },
    "teachers": {
        "prof_john": {"name": "Prof. John", "password": "prof123", "department": "CS"}
    },
    "announcements": [
        {"title": "Welcome", "message": "Registration open", "date": "2026-11-05", "priority": "High"}
    ]
}

def load_data():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as f:
            return json.load(f)
    save_data(DEFAULT_DATA)
    return DEFAULT_DATA

def save_data(d):
    with open(DATA_FILE, 'w') as f:
        json.dump(d, f, indent=2)

data = load_data()
root = tk.Tk()
root.title("College Registration")
root.geometry("800x600")

def clear():
    for w in root.winfo_children():
        w.destroy()

# LOGIN
def login_screen():
    clear()
    f = tk.Frame(root, bg="white")
    f.pack(fill="both", expand=True, padx=50, pady=100)
    
    tk.Label(f, text="LOGIN", font=("Arial", 16, "bold"), bg="white").pack(pady=20)
    
    tk.Label(f, text="Role:", bg="white").pack(anchor="w", padx=30)
    role = tk.StringVar(value="Student")
    ttk.Combobox(f, textvariable=role, values=["Admin", "Student", "Teacher"], state="readonly", width=30).pack(anchor="w", padx=30, pady=5)
    
    tk.Label(f, text="Username:", bg="white").pack(anchor="w", padx=30, pady=(15, 0))
    user = tk.Entry(f, width=30)
    user.pack(anchor="w", padx=30, pady=5)
    
    tk.Label(f, text="Password:", bg="white").pack(anchor="w", padx=30, pady=(15, 0))
    pwd = tk.Entry(f, width=30, show="*")
    pwd.pack(anchor="w", padx=30, pady=5)
    
    def login():
        r = role.get()
        u = user.get().strip()
        p = pwd.get().strip()
        
        if r == "Admin" and u == "admin" and p == "admin123":
            admin_screen()
        elif r == "Student" and u in data["students"] and data["students"][u]["password"] == p:
            student_screen(u)
        elif r == "Teacher" and u in data["teachers"] and data["teachers"][u]["password"] == p:
            teacher_screen(u)
        else:
            messagebox.showerror("Error", "Wrong credentials")
    
    tk.Button(f, text="LOGIN", command=login, bg="#2874a6", fg="white", width=30, pady=12).pack(pady=30)

# ADMIN SCREEN
def admin_screen():
    clear()
    f = tk.Frame(root, bg="white")
    f.pack(fill="both", expand=True)
    
    # Header
    hdr = tk.Frame(f, bg="#2874a6", height=70)
    hdr.pack(fill="x")
    hdr.pack_propagate(False)
    
    hdr_in = tk.Frame(hdr, bg="#2874a6")
    hdr_in.pack(fill="both", expand=True, padx=20)
    tk.Label(hdr_in, text="ADMIN PANEL", font=("Arial", 16, "bold"), bg="#2874a6", fg="white").pack(side="left", pady=20)
    tk.Button(hdr_in, text="LOGOUT", command=login_screen, bg="#c0392b", fg="white", width=12).pack(side="right", padx=10, pady=20)
    
    # Buttons
    btn_f = tk.Frame(f, bg="#f0f0f0")
    btn_f.pack(fill="x", padx=5, pady=5)
    
    def add_student():
        w = tk.Toplevel(root)
        w.title("Add Student")
        w.geometry("350x300")
        tk.Label(w, text="ADD STUDENT", font=("Arial", 12, "bold")).pack(pady=10)
        
        tk.Label(w, text="Name:").pack(anchor="w", padx=20)
        ne = tk.Entry(w, width=30)
        ne.pack(anchor="w", padx=20, pady=5)
        
        tk.Label(w, text="Username:").pack(anchor="w", padx=20)
        ue = tk.Entry(w, width=30)
        ue.pack(anchor="w", padx=20, pady=5)
        
        tk.Label(w, text="Password:").pack(anchor="w", padx=20)
        pe = tk.Entry(w, width=30, show="*")
        pe.pack(anchor="w", padx=20, pady=5)
        
        def save():
            n = ne.get()
            u = ue.get()
            p = pe.get()
            if n and u and p:
                data["students"][u] = {"name": n, "password": p, "program": "BCA", "cgpa": 8.0, "roll_no": "001", "semester": 1}
                save_data(data)
                messagebox.showinfo("Success", "Student added!")
                w.destroy()
            else:
                messagebox.showerror("Error", "Fill all fields")
        
        tk.Button(w, text="SAVE", command=save, bg="#229954", fg="white", width=25).pack(pady=20)
    
    def view_ann():
        anns = data.get("announcements", [])
        if not anns:
            messagebox.showinfo("Announcements", "No announcements")
            return
        text = "ANNOUNCEMENTS\n" + "="*40 + "\n\n"
        for a in anns:
            text += f"[{a['priority']}] {a['title']}\n{a['message']}\nDate: {a['date']}\n\n"
        messagebox.showinfo("Announcements", text)
    
    def post_ann():
        w = tk.Toplevel(root)
        w.title("Post Announcement")
        w.geometry("350x300")
        tk.Label(w, text="POST ANNOUNCEMENT", font=("Arial", 12, "bold")).pack(pady=10)
        
        tk.Label(w, text="Title:").pack(anchor="w", padx=20)
        te = tk.Entry(w, width=30)
        te.pack(anchor="w", padx=20, pady=5)
        
        tk.Label(w, text="Message:").pack(anchor="w", padx=20)
        me = tk.Text(w, width=30, height=4)
        me.pack(anchor="w", padx=20, pady=5)
        
        def save():
            t = te.get()
            m = me.get("1.0", tk.END).strip()
            if t and m:
                data["announcements"].insert(0, {"title": t, "message": m, "date": datetime.now().strftime("%Y-%m-%d"), "priority": "Normal"})
                save_data(data)
                messagebox.showinfo("Success", "Posted!")
                w.destroy()
            else:
                messagebox.showerror("Error", "Fill all")
        
        tk.Button(w, text="POST", command=save, bg="#16a085", fg="white", width=25).pack(pady=20)
    
    tk.Button(btn_f, text="Add Student", command=add_student, bg="#229954", fg="white", width=15).pack(side="left", padx=2, pady=5)
    tk.Button(btn_f, text="View Announcements", command=view_ann, bg="#2980b9", fg="white", width=15).pack(side="left", padx=2, pady=5)
    tk.Button(btn_f, text="Post Announcement", command=post_ann, bg="#16a085", fg="white", width=15).pack(side="left", padx=2, pady=5)
    tk.Button(btn_f, text="Total Students: " + str(len(data["students"])), command=lambda: messagebox.showinfo("Stats", f"Students: {len(data['students'])}"), bg="#3498db", fg="white", width=15).pack(side="left", padx=2, pady=5)

# STUDENT SCREEN
def student_screen(username):
    clear()
    st = data["students"][username]
    f = tk.Frame(root, bg="white")
    f.pack(fill="both", expand=True)
    
    # Header
    hdr = tk.Frame(f, bg="#f39c12", height=70)
    hdr.pack(fill="x")
    hdr.pack_propagate(False)
    
    hdr_in = tk.Frame(hdr, bg="#f39c12")
    hdr_in.pack(fill="both", expand=True, padx=20)
    tk.Label(hdr_in, text="STUDENT PANEL", font=("Arial", 16, "bold"), bg="#f39c12", fg="white").pack(side="left", pady=20)
    tk.Button(hdr_in, text="LOGOUT", command=login_screen, bg="#c0392b", fg="white", width=12).pack(side="right", padx=10, pady=20)
    
    # Content
    cnt = tk.Frame(f, bg="white")
    cnt.pack(fill="both", expand=True, padx=40, pady=30)
    
    tk.Label(cnt, text=f"Welcome, {st['name']}", font=("Arial", 14, "bold"), bg="white").pack(anchor="w")
    tk.Label(cnt, text=f"Program: {st['program']} | CGPA: {st['cgpa']}", font=("Arial", 11), bg="white").pack(anchor="w", pady=(5, 20))
    
    # Buttons
    def view_profile():
        w = tk.Toplevel(root)
        w.title("ID Card")
        w.geometry("400x350")
        f = tk.Frame(w, bg="white", relief="solid", bd=2)
        f.pack(padx=20, pady=20, fill="both", expand=True)
        
        hdr = tk.Frame(f, bg="#2874a6")
        hdr.pack(fill="x", padx=10, pady=10)
        tk.Label(hdr, text="COLLEGE ID CARD", font=("Arial", 12, "bold"), bg="#2874a6", fg="white").pack()
        
        info = tk.Frame(f, bg="white")
        info.pack(fill="both", expand=True, padx=20, pady=20)
        
        ph = tk.Frame(info, bg="#e8e8e8", width=80, height=100)
        ph.pack(pady=(0, 15))
        ph.pack_propagate(False)
        tk.Label(ph, text="[PHOTO]", bg="#e8e8e8").pack(expand=True)
        
        det = f"""Name: {st['name']}
Roll: {st['roll_no']}
Program: {st['program']}
CGPA: {st['cgpa']}"""
        
        tk.Label(info, text=det, font=("Arial", 10), bg="white", justify="left").pack(fill="x")
    
    def view_ann():
        anns = data.get("announcements", [])
        if not anns:
            messagebox.showinfo("Announcements", "No announcements")
            return
        text = "ANNOUNCEMENTS\n" + "="*40 + "\n\n"
        for a in anns:
            text += f"[{a['priority']}] {a['title']}\n{a['message']}\nDate: {a['date']}\n\n"
        messagebox.showinfo("Announcements", text)
    
    bframe = tk.Frame(cnt, bg="white")
    bframe.pack(fill="x", pady=10)
    
    tk.Button(bframe, text="View Profile", command=view_profile, bg="#3498db", fg="white", width=20).pack(side="left", padx=5)
    tk.Button(bframe, text="View Announcements", command=view_ann, bg="#f39c12", fg="white", width=20).pack(side="left", padx=5)

# TEACHER SCREEN
def teacher_screen(username):
    clear()
    tch = data["teachers"][username]
    f = tk.Frame(root, bg="white")
    f.pack(fill="both", expand=True)
    
    hdr = tk.Frame(f, bg="#8e44ad", height=70)
    hdr.pack(fill="x")
    hdr.pack_propagate(False)
    
    hdr_in = tk.Frame(hdr, bg="#8e44ad")
    hdr_in.pack(fill="both", expand=True, padx=20)
    tk.Label(hdr_in, text="TEACHER PANEL", font=("Arial", 16, "bold"), bg="#8e44ad", fg="white").pack(side="left", pady=20)
    tk.Button(hdr_in, text="LOGOUT", command=login_screen, bg="#c0392b", fg="white", width=12).pack(side="right", padx=10, pady=20)
    
    cnt = tk.Frame(f, bg="white")
    cnt.pack(fill="both", expand=True, padx=40, pady=30)
    
    tk.Label(cnt, text=f"Welcome, {tch['name']}", font=("Arial", 14, "bold"), bg="white").pack(anchor="w")
    tk.Label(cnt, text=f"Department: {tch['department']}", font=("Arial", 11), bg="white").pack(anchor="w", pady=(5, 20))

login_screen()
root.mainloop()
