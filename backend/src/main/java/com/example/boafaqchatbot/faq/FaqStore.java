package com.example.boafaqchatbot.faq;

import com.example.boafaqchatbot.ai.OllamaClient;
import com.example.boafaqchatbot.util.TextNorm;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.*;

@Component
public class FaqStore {

    private final String excelPath;
    private final FaqRepository repository;
    private final OllamaClient ollama;
    private volatile List<FaqItem> items = List.of();

    public FaqStore(@Value("${app.faq.excel-path}") String excelPath, FaqRepository repository, OllamaClient ollama) {
        this.excelPath = excelPath;
        this.repository = repository;
        this.ollama = ollama;
        reload();
    }

    public List<FaqItem> all() {
        return items;
    }

    public synchronized void reload() {
        try {
            System.out.println("🧹 Nettoyage de la base FAQ pour synchronisation fraîche...");
            // Optionally clear repository or just sync
            syncExcelToDb();
            this.items = Collections.unmodifiableList(repository.findAll());
            System.out.println("✅ FAQ chargée : " + items.size() + " questions (avec embeddings frais)");
        } catch (Exception e) {
            System.err.println("⚠️ Impossible de charger la FAQ : " + e.getMessage());
            this.items = List.of();
        }
    }

    private void syncExcelToDb() throws Exception {
        List<FaqItem> excelItems = loadFromExcel();
        System.out.println("📦 Sync: " + excelItems.size() + " items trouvés dans l'Excel");
        int updated = 0;
        int created = 0;

        for (FaqItem item : excelItems) {
            Optional<FaqItem> existing = repository.findByQuestion(item.question());
            if (existing.isEmpty()) {
                System.out.println("✨ Nouvelle question : " + item.question());
                double[] emb = ollama.embeddings(item.question());
                if (emb != null) {
                    item.setEmbedding(emb);
                    repository.save(item);
                    created++;
                } else {
                    System.err.println("❌ Échec de génération d'embedding pour : " + item.question());
                }
            } else {
                FaqItem f = existing.get();
                if (f.embedding() == null || f.embedding().length == 0) {
                    System.out.println("🔄 Embedding manquant pour : " + f.question());
                    double[] emb = ollama.embeddings(f.question());
                    if (emb != null) {
                        f.setEmbedding(emb);
                        repository.save(f);
                        updated++;
                    } else {
                        System.err.println("❌ Échec de régénération d'embedding pour : " + f.question());
                    }
                }
            }
        }
        System.out.println("✅ Sync terminé : " + created + " créés, " + updated + " mis à jour");
    }

    private List<FaqItem> loadFromExcel() throws Exception {
        ClassPathResource res = new ClassPathResource(excelPath);
        if (!res.exists()) {
            throw new IllegalStateException("Fichier introuvable : " + excelPath);
        }

        try (InputStream is = res.getInputStream();
                Workbook wb = new XSSFWorkbook(is)) {

            Sheet sheet = wb.getSheetAt(0);
            Iterator<Row> it = sheet.iterator();

            if (!it.hasNext())
                return List.of();
            it.next(); // skip header

            List<FaqItem> list = new ArrayList<>();

            while (it.hasNext()) {
                Row r = it.next();

                if (r.getCell(0) == null || r.getCell(1) == null)
                    continue;
                if (r.getCell(0).getCellType() != org.apache.poi.ss.usermodel.CellType.STRING)
                    continue;
                if (r.getCell(1).getCellType() != org.apache.poi.ss.usermodel.CellType.STRING)
                    continue;

                String q = r.getCell(0).getStringCellValue().trim();
                String a = r.getCell(1).getStringCellValue().trim();

                if (!q.isEmpty() && !a.isEmpty()) {
                    list.add(new FaqItem(q, a, TextNorm.norm(q)));
                }
            }

            return list;
        }
    }
}
