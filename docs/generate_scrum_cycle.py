# -*- coding: utf-8 -*-
"""
Génère un schéma professionnel du Cycle Scrum et de ses 4 réunions.
"""
import os
import matplotlib.pyplot as plt
import matplotlib.patches as patches

# Configuration de la figure
fig, ax = plt.subplots(figsize=(12, 8), dpi=300)
fig.patch.set_facecolor('#ffffff')
ax.set_facecolor('#f8fafc')

# Désactiver les axes
ax.axis('off')
ax.set_xlim(-4.5, 4.5)
ax.set_ylim(-3, 3)

# Palette de couleurs premium
c_backlog = '#475569'      # Slate
c_planning = '#3b82f6'     # Blue
c_sprint = '#6366f1'       # Indigo
c_daily = '#8b5cf6'        # Violet
c_review = '#db2777'       # Pink
c_retro = '#10b981'        # Green
c_text_dark = '#0f172a'    # Dark slate

# 1. Dessiner les blocs principaux (Rectangles)

# Product Backlog (Gauche)
rect_backlog = patches.FancyBboxPatch((-4.2, -0.6), 1.4, 1.2, boxstyle="round,pad=0.1", 
                                     linewidth=1.5, edgecolor=c_backlog, facecolor='#f1f5f9')
ax.add_patch(rect_backlog)
ax.text(-3.5, 0, "Product\nBacklog", ha='center', va='center', color=c_text_dark, fontweight='bold', fontsize=11)

# Sprint Planning (Réunion 1)
rect_planning = patches.FancyBboxPatch((-2.3, -0.6), 1.2, 1.2, boxstyle="round,pad=0.1", 
                                      linewidth=1.5, edgecolor=c_planning, facecolor='#eff6ff')
ax.add_patch(rect_planning)
ax.text(-1.7, 0, "1. Planification\ndu Sprint\n(Planning)", ha='center', va='center', color=c_planning, fontweight='bold', fontsize=10)

# Sprint Backlog
rect_sprint_backlog = patches.FancyBboxPatch((-0.7, -0.6), 1.0, 1.2, boxstyle="round,pad=0.1", 
                                             linewidth=1.5, edgecolor=c_backlog, facecolor='#f1f5f9')
ax.add_patch(rect_sprint_backlog)
ax.text(-0.2, 0, "Sprint\nBacklog", ha='center', va='center', color=c_text_dark, fontweight='bold', fontsize=10)

# Le Sprint (Cercle Central)
sprint_circle = patches.Wedge((1.3, 0), 1.1, 0, 360, width=0.18, facecolor=c_sprint, alpha=0.95)
ax.add_patch(sprint_circle)
ax.text(1.3, 0, "Sprint\n2 semaines", ha='center', va='center', color='white', fontweight='bold', fontsize=12)

# Mêlée Quotidienne (Réunion 2 - boucle au dessus du sprint)
daily_circle = patches.Wedge((1.3, 1.2), 0.4, -40, 220, width=0.08, facecolor=c_daily, alpha=0.9)
ax.add_patch(daily_circle)
ax.text(1.3, 1.8, "2. Mêlée Quotidienne\n(Daily Scrum - 15 min)", ha='center', va='center', color=c_daily, fontweight='bold', fontsize=9.5)

# Revue de Sprint (Réunion 3 - Droite)
rect_review = patches.FancyBboxPatch((2.7, 0.4), 1.4, 0.9, boxstyle="round,pad=0.1", 
                                    linewidth=1.5, edgecolor=c_review, facecolor='#fdf2f8')
ax.add_patch(rect_review)
ax.text(3.4, 0.85, "3. Revue\nde Sprint", ha='center', va='center', color=c_review, fontweight='bold', fontsize=10.5)

# Rétrospective de Sprint (Réunion 4 - Bas)
rect_retro = patches.FancyBboxPatch((0.6, -2.1), 1.4, 0.9, boxstyle="round,pad=0.1", 
                                   linewidth=1.5, edgecolor=c_retro, facecolor='#ecfdf5')
ax.add_patch(rect_retro)
ax.text(1.3, -1.65, "4. Rétrospective\nde Sprint", ha='center', va='center', color=c_retro, fontweight='bold', fontsize=10.5)


# 2. Dessiner les flèches directionnelles

# Backlog -> Planning
ax.annotate('', xy=(-2.45, 0), xytext=(-2.65, 0),
            arrowprops=dict(arrowstyle="->", lw=2.5, color=c_backlog))

# Planning -> Sprint Backlog
ax.annotate('', xy=(-0.85, 0), xytext=(-1.0, 0),
            arrowprops=dict(arrowstyle="->", lw=2.5, color=c_planning))

# Sprint Backlog -> Sprint
ax.annotate('', xy=(0.1, 0), xytext=(0.0, 0),
            arrowprops=dict(arrowstyle="->", lw=2.5, color=c_sprint))

# Sprint -> Revue (Sortie)
ax.annotate('', xy=(2.7, 0.85), xytext=(2.3, 0.4),
            arrowprops=dict(arrowstyle="->", lw=2.5, color=c_review))

# Revue -> Rétro
ax.annotate('', xy=(1.5, -1.1), xytext=(3.4, 0.3),
            arrowprops=dict(arrowstyle="->", lw=2.5, color=c_retro, connectionstyle="arc3,rad=-0.2"))

# Rétro -> Planning (Boucle de feedback pour le prochain Sprint)
ax.annotate('', xy=(-1.7, -0.75), xytext=(0.5, -1.65),
            arrowprops=dict(arrowstyle="->", lw=2, color=c_planning, linestyle='--',
                            connectionstyle="arc3,rad=0.3"))

# Titre du diagramme
plt.title("Le Cycle Méthodologique SCRUM et ses 4 Réunions", fontsize=15, fontweight='bold', color=c_text_dark, pad=15)

# Légende / Notes explicatives en bas
note_text = ("• Sprint Planning : Définition des tâches et engagement de l'équipe\n"
             "• Mêlée Quotidienne : Point de 15 minutes sur l'avancement et blocages\n"
             "• Sprint Review : Démonstration des fonctionnalités terminées au client\n"
             "• Sprint Rétrospective : Analyse humaine/technique pour s'améliorer")
ax.text(0, -2.8, note_text, ha='center', va='center', fontsize=9.5, color='#475569', 
        bbox=dict(facecolor='#f8fafc', edgecolor='#cbd5e1', boxstyle='round,pad=0.5'))

# Sauvegarde de l'image
out = os.path.join(os.path.dirname(__file__), 'scrum_cycle.png')
plt.savefig(out, facecolor=fig.get_facecolor(), bbox_inches='tight')
print("Schéma du cycle Scrum généré dans :", out)
