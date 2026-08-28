import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

from main import (
    read_root,
    get_feed,
    create_feed_post,
    toggle_like_post,
    add_post_comment,
    get_reels,
    create_reel,
    toggle_like_reel,
    get_clubs,
    join_or_leave_club,
    get_messages,
    send_message,
    get_profile,
    update_profile,
    get_settings,
    update_settings,
    get_notes,
    upload_note,
    get_question_papers,
    upload_question_paper,
    get_questions,
    ask_question,
    get_question_by_id,
    answer_question,
    toggle_upvote_question,
    signup_user,
    login_user,
    PostCreate,
    CommentCreate,
    ReelCreate,
    MessageSend,
    ProfileUpdate,
    SettingsUpdate,
    NoteCreate,
    QuestionCreate,
    AnswerCreate,
    QuestionPaperCreate,
    SignupRequest,
    LoginRequest,
)

def run_tests():
    print("--- 1. Testing Root / Health Endpoint ---")
    root = read_root()
    assert root["status"] == "online"
    print("[PASS] read_root() ->", root["message"])

    print("\n--- 2. Testing Feed Endpoints ---")
    feed = get_feed()
    assert "feed" in feed
    assert len(feed["feed"]) >= 3
    print(f"[PASS] get_feed() -> {len(feed['feed'])} posts loaded")

    new_post = create_feed_post(PostCreate(content="Excited for campus fest!", tags=["#Fest"]))
    assert new_post["status"] == "success"
    print(f"[PASS] create_feed_post() -> Post ID {new_post['post']['id']} created")

    liked = toggle_like_post(1)
    assert liked["status"] == "success"
    print(f"[PASS] toggle_like_post(1) -> Likes now: {liked['post']['likes']}")

    commented = add_post_comment(1, CommentCreate(text="Great update!"))
    assert commented["status"] == "success"
    print("[PASS] add_post_comment(1) -> Added comment successfully")

    print("\n--- 3. Testing Reels Endpoints ---")
    reels = get_reels()
    assert "reels" in reels
    print(f"[PASS] get_reels() -> {len(reels['reels'])} reels loaded")

    new_reel = create_reel(ReelCreate(caption="Central lawn flashmob!", audio="Fest EDM"))
    assert new_reel["status"] == "success"
    print("[PASS] create_reel() -> Created reel ID", new_reel["reel"]["id"])

    liked_reel = toggle_like_reel(1)
    assert liked_reel["status"] == "success"
    print("[PASS] toggle_like_reel(1) -> Success")

    print("\n--- 4. Testing Clubs Endpoints ---")
    clubs = get_clubs()
    assert "clubs" in clubs
    print(f"[PASS] get_clubs() -> {len(clubs['clubs'])} clubs loaded")

    club_join = join_or_leave_club(2)
    assert club_join["status"] == "success"
    print(f"[PASS] join_or_leave_club(2) -> {club_join['message']}")

    print("\n--- 5. Testing Messages Endpoints ---")
    msgs = get_messages()
    assert "conversations" in msgs
    print(f"[PASS] get_messages() -> {len(msgs['conversations'])} conversations loaded")

    sent = send_message(MessageSend(conversation_id=1, text="Yes I solved it!"))
    assert sent["status"] == "success"
    print("[PASS] send_message() -> Sent message:", sent["message"]["text"])

    print("\n--- 6. Testing Profile Endpoints ---")
    prof = get_profile()
    assert "profile" in prof
    print(f"[PASS] get_profile() -> Student: {prof['profile']['name']} ({prof['profile']['university']})")

    prof_updated = update_profile(ProfileUpdate(bio="Updated bio for testing!"))
    assert prof_updated["profile"]["bio"] == "Updated bio for testing!"
    print("[PASS] update_profile() -> Updated bio")

    print("\n--- 7. Testing Settings Endpoints ---")
    sett = get_settings()
    assert "settings" in sett
    print("[PASS] get_settings() -> Loaded user settings")

    sett_updated = update_settings(SettingsUpdate(dark_theme=True, email_notifications=True))
    assert sett_updated["settings"]["dark_theme"] is True
    print("[PASS] update_settings() -> Updated settings")

    print("\n--- 8. Testing Notes Endpoints ---")
    notes = get_notes()
    assert "notes" in notes
    print(f"[PASS] get_notes() -> {len(notes['notes'])} notes loaded")

    new_note = upload_note(NoteCreate(title="Automata Notes", subject="TCS 501", semester="5th Semester", branch="B.Tech CSE"))
    assert new_note["status"] == "success"
    print("[PASS] upload_note() -> Created note ID", new_note["note"]["id"])

    print("\n--- 9. Testing Question Papers Endpoints ---")
    qps = get_question_papers()
    assert "question_papers" in qps
    print(f"[PASS] get_question_papers() -> {len(qps['question_papers'])} question papers loaded")

    new_qp = upload_question_paper(QuestionPaperCreate(
        subject="Compiler Design",
        subject_code="TCS 602",
        exam_type="End-Term Examination",
        year="2024",
        semester="6th Semester",
        branch="B.Tech CSE"
    ))
    assert new_qp["status"] == "success"
    print("[PASS] upload_question_paper() -> Added PYQ ID", new_qp["question_paper"]["id"])

    print("\n--- 10. Testing Auth Endpoints ---")
    signup = signup_user(SignupRequest(
        username="anita_gehu",
        email="anita.test@gehu.ac.in",
        password="password123",
        university="Graphic Era Hill University",
        branch="B.Tech AI-DS"
    ))
    assert signup["status"] == "success"
    print("[PASS] signup_user() ->", signup["message"])

    login = login_user(LoginRequest(
        email="devansh.220110892@geu.ac.in",
        password="password123"
    ))
    assert login["status"] == "success"
    print("[PASS] login_user() ->", login["message"])

    print("\n--- 11. Testing Questions & Campus Doubts (Q&A) ---")
    qs = get_questions()
    assert "questions" in qs
    assert len(qs["questions"]) >= 2
    print(f"[PASS] get_questions() -> {len(qs['questions'])} campus questions loaded")

    new_q = ask_question(QuestionCreate(
        title="Best resources to prepare for Graphic Era placement coding rounds?",
        description="Which platforms and syllabus does TCS / Infosys / Amazon test in GEU campus placement?",
        subject="Placement Prep",
        tags=["#Placements", "#GEU2026", "#Coding"]
    ))
    assert new_q["status"] == "success"
    q_id = new_q["question"]["id"]
    print(f"[PASS] ask_question() -> Posted question ID {q_id}: '{new_q['question']['title']}'")

    single_q = get_question_by_id(q_id)
    assert single_q["status"] == "success"
    print(f"[PASS] get_question_by_id({q_id}) -> Found question")

    ans = answer_question(q_id, AnswerCreate(text="Practice Striver SDE sheet and previous year campus assessment questions!"))
    assert ans["status"] == "success"
    print(f"[PASS] answer_question({q_id}) -> Added answer")

    upvoted = toggle_upvote_question(q_id)
    assert upvoted["status"] == "success"
    assert upvoted["question"]["upvotes"] == 1
    print(f"[PASS] toggle_upvote_question({q_id}) -> Upvotes now: {upvoted['question']['upvotes']}")

    print("\n=======================================================")
    print("ALL 11 MODULES TESTED AND PASSED 100% SUCCESSFULLY!")
    print("=======================================================")

if __name__ == "__main__":
    run_tests()
