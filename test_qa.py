from chatbot_engine import ChatbotEngine
import sys

# Force UTF-8 encoding for Windows console
try:
    sys.stdout.reconfigure(encoding='utf-8')
except AttributeError:
    pass


def test_qa():
    bot = ChatbotEngine()
    
    questions = [
        "C'est quoi un formulaire ?",
        "Qui a inventé les formulaires ?",
        "A quoi ça sert ?",
        "Bonjour",
        "Je veux apprendre les zones de saisie"
    ]
    
    print("--- TEST Q&A ---")
    
    for q in questions:
        print(f"\nQuestion: '{q}'")
        res = bot.get_response(q, "TestUser", "2nde", {}, [], None)
        response_text = res["response"]
        
        # Check if it's a general answer (starts with "Un **formulaire**", "Les formulaires...", "Ils servent à...")
        # or a greeting or topic content.
        print(f"Réponse: {response_text[:50]}...")

        if "Tim Berners-Lee" in response_text or "bon de commande" in response_text or "discuter" in response_text:
             print(">> SUCCESS: General Knowledge detected")
        elif "CodeBot" in response_text:
             print(">> GREETING detected")
        elif "Zones de saisie" in response_text:
             print(">> TOPIC detected")
        else:
             print(">> UNKNOWN response type")

if __name__ == "__main__":
    test_qa()
