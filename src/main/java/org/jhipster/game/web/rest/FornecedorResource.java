package org.jhipster.game.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.jhipster.game.domain.Fornecedor;
import org.jhipster.game.repository.FornecedorRepository;
import org.jhipster.game.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link org.jhipster.game.domain.Fornecedor}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class FornecedorResource {

    private final Logger log = LoggerFactory.getLogger(FornecedorResource.class);

    private static final String ENTITY_NAME = "fornecedor";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FornecedorRepository fornecedorRepository;

    public FornecedorResource(FornecedorRepository fornecedorRepository) {
        this.fornecedorRepository = fornecedorRepository;
    }

    /**
     * {@code POST  /fornecedors} : Create a new fornecedor.
     *
     * @param fornecedor the fornecedor to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new fornecedor, or with status {@code 400 (Bad Request)} if the fornecedor has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/fornecedors")
    public ResponseEntity<Fornecedor> createFornecedor(@RequestBody Fornecedor fornecedor) throws URISyntaxException {
        log.debug("REST request to save Fornecedor : {}", fornecedor);
        if (fornecedor.getId() != null) {
            throw new BadRequestAlertException("A new fornecedor cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Fornecedor result = fornecedorRepository.save(fornecedor);
        return ResponseEntity
            .created(new URI("/api/fornecedors/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /fornecedors/:id} : Updates an existing fornecedor.
     *
     * @param id the id of the fornecedor to save.
     * @param fornecedor the fornecedor to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated fornecedor,
     * or with status {@code 400 (Bad Request)} if the fornecedor is not valid,
     * or with status {@code 500 (Internal Server Error)} if the fornecedor couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/fornecedors/{id}")
    public ResponseEntity<Fornecedor> updateFornecedor(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Fornecedor fornecedor
    ) throws URISyntaxException {
        log.debug("REST request to update Fornecedor : {}, {}", id, fornecedor);
        if (fornecedor.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, fornecedor.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!fornecedorRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Fornecedor result = fornecedorRepository.save(fornecedor);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, fornecedor.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /fornecedors/:id} : Partial updates given fields of an existing fornecedor, field will ignore if it is null
     *
     * @param id the id of the fornecedor to save.
     * @param fornecedor the fornecedor to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated fornecedor,
     * or with status {@code 400 (Bad Request)} if the fornecedor is not valid,
     * or with status {@code 404 (Not Found)} if the fornecedor is not found,
     * or with status {@code 500 (Internal Server Error)} if the fornecedor couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/fornecedors/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Fornecedor> partialUpdateFornecedor(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Fornecedor fornecedor
    ) throws URISyntaxException {
        log.debug("REST request to partial update Fornecedor partially : {}, {}", id, fornecedor);
        if (fornecedor.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, fornecedor.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!fornecedorRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Fornecedor> result = fornecedorRepository
            .findById(fornecedor.getId())
            .map(existingFornecedor -> {
                if (fornecedor.getNome() != null) {
                    existingFornecedor.setNome(fornecedor.getNome());
                }

                return existingFornecedor;
            })
            .map(fornecedorRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, fornecedor.getId().toString())
        );
    }

    /**
     * {@code GET  /fornecedors} : get all the fornecedors.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of fornecedors in body.
     */
    @GetMapping("/fornecedors")
    public List<Fornecedor> getAllFornecedors() {
        log.debug("REST request to get all Fornecedors");
        return fornecedorRepository.findAll();
    }

    /**
     * {@code GET  /fornecedors/:id} : get the "id" fornecedor.
     *
     * @param id the id of the fornecedor to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the fornecedor, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/fornecedors/{id}")
    public ResponseEntity<Fornecedor> getFornecedor(@PathVariable Long id) {
        log.debug("REST request to get Fornecedor : {}", id);
        Optional<Fornecedor> fornecedor = fornecedorRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(fornecedor);
    }

    /**
     * {@code DELETE  /fornecedors/:id} : delete the "id" fornecedor.
     *
     * @param id the id of the fornecedor to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/fornecedors/{id}")
    public ResponseEntity<Void> deleteFornecedor(@PathVariable Long id) {
        log.debug("REST request to delete Fornecedor : {}", id);
        fornecedorRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
