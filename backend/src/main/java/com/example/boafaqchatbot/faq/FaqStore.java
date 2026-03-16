package com.example.boafaqchatbot.faq;

import com.example.boafaqchatbot.util.TextNorm;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;

@Component
public class FaqStore {

    private final String excelPath;
    private volatile List<FaqItem> items = List.of();

    public FaqStore(@Value("${app.faq.excel-path}") String excelPath) {
        this.excelPath = excelPath;
        reload();
    }

    public List<FaqItem> all() {
        return items;
    }

    public synchronized void reload() {
        try {
            this.items = Collections.unmodifiableList(load());
            System.out.println("✅ FAQ chargée : " + items.size() + " questions");
        } catch (Exception e) {
            System.err.println("⚠️ Impossible de charger la FAQ : " + e.getMessage());
            this.items = List.of();
        }
    }

    private List<FaqItem> load() throws Exception {
        ClassPathResource res = new ClassPathResource(excelPath);
        if (!res.exists()) {
            throw new IllegalStateException("Fichier introuvable : " + excelPath);
        }

        try (InputStream is = res.getInputStream();
             Workbook wb = new XSSFWorkbook(is)) {

            Sheet sheet = wb.getSheetAt(0);
            Iterator<Row> it = sheet.iterator();

            if (!it.hasNext()) return List.of();
            it.next(); // skip header

            List<FaqItem> list = new ArrayList<>();

            while (it.hasNext()) {
                Row r = it.next();

                if (r.getCell(0) == null || r.getCell(1) == null) continue;
                if (r.getCell(0).getCellType() != org.apache.poi.ss.usermodel.CellType.STRING) continue;
                if (r.getCell(1).getCellType() != org.apache.poi.ss.usermodel.CellType.STRING) continue;

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

